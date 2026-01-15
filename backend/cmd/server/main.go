package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/Jakeito/TestWebsite/backend/internal/auth"
	"github.com/Jakeito/TestWebsite/backend/internal/config"
	"github.com/Jakeito/TestWebsite/backend/internal/database"
	"github.com/Jakeito/TestWebsite/backend/internal/handlers"
	"github.com/Jakeito/TestWebsite/backend/internal/middleware"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Connect to database
	db, err := database.New(cfg.DatabaseURL())
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Run migrations
	if err := db.RunMigrations("./migrations"); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Seed gallery images from public/images directory
	if err := db.SeedGalleryImages(); err != nil {
		log.Printf("Warning: Failed to seed gallery images: %v", err)
	}

	// Create admin user if it doesn't exist
	if err := createAdminUser(db, cfg); err != nil {
		log.Printf("Warning: Failed to create admin user: %v", err)
	}

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(db, cfg.JWTSecret)
	aboutHandler := handlers.NewAboutHandler(db)
	resumeHandler := handlers.NewResumeHandler(db)
	carBuildHandler := handlers.NewCarBuildHandler(db)
	contactHandler := handlers.NewContactHandler(db)
	imageHandler := handlers.NewImageHandler(db)
	galleryHandler := handlers.NewGalleryHandler(db)

	// Setup router
	r := mux.NewRouter()

	// Serve static files from public directory
	r.PathPrefix("/public/").Handler(http.StripPrefix("/public/", http.FileServer(http.Dir("./public"))))

	// Health check / root endpoint
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","message":"TestWebsite Backend API"}`))
	}).Methods("GET")

	// Public routes
	r.HandleFunc("/api/login", authHandler.Login).Methods("POST")
	r.HandleFunc("/api/about", aboutHandler.GetAboutContent).Methods("GET")
	r.HandleFunc("/api/resume", resumeHandler.GetResumeSections).Methods("GET")
	r.HandleFunc("/api/carbuild", carBuildHandler.GetCarBuildEntries).Methods("GET")
	r.HandleFunc("/api/contact", contactHandler.SubmitContact).Methods("POST")
	r.HandleFunc("/api/images", imageHandler.GetImages).Methods("GET")
	r.HandleFunc("/api/image/{id}", galleryHandler.GetImage).Methods("GET")

	// Protected routes (require authentication)
	authRouter := r.PathPrefix("/api").Subrouter()
	authRouter.Use(middleware.AuthMiddleware(cfg.JWTSecret))

	// Admin-only routes
	adminRouter := authRouter.PathPrefix("").Subrouter()
	adminRouter.Use(middleware.AdminMiddleware)

	// Admin routes for about content
	adminRouter.HandleFunc("/about", aboutHandler.CreateAboutContent).Methods("POST")
	adminRouter.HandleFunc("/about/{id}", aboutHandler.UpdateAboutContent).Methods("PUT")
	adminRouter.HandleFunc("/about/{id}", aboutHandler.DeleteAboutContent).Methods("DELETE")

	// Admin routes for resume
	adminRouter.HandleFunc("/resume", resumeHandler.CreateResumeSection).Methods("POST")
	adminRouter.HandleFunc("/resume/{id}", resumeHandler.UpdateResumeSection).Methods("PUT")
	adminRouter.HandleFunc("/resume/{id}", resumeHandler.DeleteResumeSection).Methods("DELETE")

	// Admin routes for car build
	adminRouter.HandleFunc("/carbuild", carBuildHandler.CreateCarBuildEntry).Methods("POST")
	adminRouter.HandleFunc("/carbuild/{id}", carBuildHandler.UpdateCarBuildEntry).Methods("PUT")
	adminRouter.HandleFunc("/carbuild/{id}", carBuildHandler.DeleteCarBuildEntry).Methods("DELETE")

	// Admin routes for contact submissions
	adminRouter.HandleFunc("/contact", contactHandler.GetContactSubmissions).Methods("GET")
	adminRouter.HandleFunc("/contact/{id}", contactHandler.DeleteContactSubmission).Methods("DELETE")

	// Admin routes for user management
	adminRouter.HandleFunc("/users", authHandler.CreateUser).Methods("POST")

	// Admin routes for gallery images
	adminRouter.HandleFunc("/gallery/upload", galleryHandler.UploadImage).Methods("POST")
	adminRouter.HandleFunc("/gallery/images", galleryHandler.ListImages).Methods("GET")
	adminRouter.HandleFunc("/gallery/image/{id}", galleryHandler.DeleteImage).Methods("DELETE")
	adminRouter.HandleFunc("/gallery/reseed", func(w http.ResponseWriter, r *http.Request) {
		// Clear existing images
		_, err := db.Exec("DELETE FROM gallery_images")
		if err != nil {
			http.Error(w, "Failed to clear images", http.StatusInternalServerError)
			return
		}
		// Reseed
		if err := db.SeedGalleryImages(); err != nil {
			http.Error(w, "Failed to seed images", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"Images reseeded successfully"}`))
	}).Methods("POST")

	// Apply CORS middleware
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:5173", "https://testwebsite-hark.onrender.com", "https://test-website-five-mu.vercel.app"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	// Start server
	addr := fmt.Sprintf(":%s", cfg.ServerPort)
	log.Printf("Server starting on %s", addr)
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

func createAdminUser(db *database.DB, cfg *config.Config) error {
	// Check if admin user exists
	var exists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", cfg.AdminEmail).Scan(&exists)
	if err != nil {
		return err
	}

	if exists {
		log.Println("Admin user already exists")
		return nil
	}

	// Create admin user
	hashedPassword, err := auth.HashPassword(cfg.AdminPassword)
	if err != nil {
		return err
	}

	_, err = db.Exec(
		"INSERT INTO users (email, password_hash, username, is_admin) VALUES ($1, $2, $3, $4)",
		cfg.AdminEmail, hashedPassword, "Admin", true,
	)
	if err != nil {
		return err
	}

	log.Println("Admin user created successfully")
	return nil
}

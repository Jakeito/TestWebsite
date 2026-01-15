package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"

	"github.com/Jakeito/TestWebsite/backend/internal/database"
	"github.com/gorilla/mux"
)

type GalleryHandler struct {
	db *database.DB
}

func NewGalleryHandler(db *database.DB) *GalleryHandler {
	return &GalleryHandler{db: db}
}

// UploadImage handles image upload to database
func (h *GalleryHandler) UploadImage(w http.ResponseWriter, r *http.Request) {
	// Parse multipart form (max 100MB total)
	if err := r.ParseMultipartForm(100 << 20); err != nil {
		http.Error(w, "Files too large", http.StatusBadRequest)
		return
	}

	folder := r.FormValue("folder")
	if folder == "" {
		folder = "gallery"
	}

	// Validate folder
	allowedFolders := map[string]bool{
		"gallery":  true,
		"about":    true,
		"carbuild": true,
		"hero":     true,
	}

	if !allowedFolders[folder] {
		http.Error(w, "Invalid folder", http.StatusBadRequest)
		return
	}

	// Handle multiple files
	files := r.MultipartForm.File["images"]
	if len(files) == 0 {
		http.Error(w, "No files provided", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	var uploadedImages []map[string]interface{}

	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			log.Printf("Error opening file %s: %v", fileHeader.Filename, err)
			continue
		}
		defer file.Close()

		// Read file data
		fileData, err := io.ReadAll(file)
		if err != nil {
			log.Printf("Error reading file %s: %v", fileHeader.Filename, err)
			continue
		}

		// Get content type
		contentType := fileHeader.Header.Get("Content-Type")
		if contentType == "" {
			contentType = "image/jpeg"
		}

		// Insert into database
		var id int
		err = h.db.QueryRow(
			"INSERT INTO gallery_images (folder, filename, image_data, content_type) VALUES ($1, $2, $3, $4) RETURNING id",
			folder, fileHeader.Filename, fileData, contentType,
		).Scan(&id)

		if err != nil {
			log.Printf("Error inserting image %s into database: %v", fileHeader.Filename, err)
			continue
		}

		uploadedImages = append(uploadedImages, map[string]interface{}{
			"id":       id,
			"filename": fileHeader.Filename,
			"folder":   folder,
			"url":      fmt.Sprintf("/api/image/%d", id),
		})
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"uploaded": len(uploadedImages),
		"images":   uploadedImages,
	})
}


// GetImage serves an image by ID
func (h *GalleryHandler) GetImage(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid image ID", http.StatusBadRequest)
		return
	}

	var imageData []byte
	var contentType string

	err = h.db.QueryRow(
		"SELECT image_data, content_type FROM gallery_images WHERE id = $1",
		id,
	).Scan(&imageData, &contentType)

	if err == sql.ErrNoRows {
		http.Error(w, "Image not found", http.StatusNotFound)
		return
	}

	if err != nil {
		http.Error(w, "Error retrieving image", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", contentType)
	w.Header().Set("Cache-Control", "public, max-age=31536000")
	w.Write(imageData)
}

// ListImages returns all images for a folder
func (h *GalleryHandler) ListImages(w http.ResponseWriter, r *http.Request) {
	folder := r.URL.Query().Get("folder")
	if folder == "" {
		folder = "gallery"
	}

	allowedFolders := map[string]bool{
		"gallery":  true,
		"about":    true,
		"carbuild": true,
		"hero":     true,
	}

	if !allowedFolders[folder] {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode([]string{})
		return
	}

	rows, err := h.db.Query(
		"SELECT id, filename FROM gallery_images WHERE folder = $1 ORDER BY display_order, created_at DESC",
		folder,
	)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode([]string{})
		return
	}
	defer rows.Close()

	var images []string
	for rows.Next() {
		var id int
		var filename string
		if err := rows.Scan(&id, &filename); err != nil {
			continue
		}
		images = append(images, fmt.Sprintf("/api/image/%d", id))
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(images)
}

// DeleteImage deletes an image by ID
func (h *GalleryHandler) DeleteImage(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid image ID", http.StatusBadRequest)
		return
	}

	_, err = h.db.Exec("DELETE FROM gallery_images WHERE id = $1", id)
	if err != nil {
		http.Error(w, "Error deleting image", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})
}

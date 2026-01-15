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
	// Parse multipart form (max 10MB)
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "File too large", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Invalid file", http.StatusBadRequest)
		return
	}
	defer file.Close()

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

	// Read file data
	fileData, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, "Error reading file", http.StatusInternalServerError)
		return
	}

	// Get content type
	contentType := header.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "image/jpeg"
	}

	// Insert into database
	var id int
	err = h.db.QueryRow(
		"INSERT INTO gallery_images (folder, filename, image_data, content_type) VALUES ($1, $2, $3, $4) RETURNING id",
		folder, header.Filename, fileData, contentType,
	).Scan(&id)

	if err != nil {
		log.Printf("Error inserting image into database: %v", err)
		http.Error(w, fmt.Sprintf("Error saving image: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":       id,
		"filename": header.Filename,
		"folder":   folder,
		"url":      fmt.Sprintf("/api/image/%d", id),
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

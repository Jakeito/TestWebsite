package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/Jakeito/TestWebsite/backend/internal/database"
)

type ImageHandler struct {
	db *database.DB
}

func NewImageHandler(db *database.DB) *ImageHandler {
	return &ImageHandler{db: db}
}

func (h *ImageHandler) GetImages(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	folder := r.URL.Query().Get("folder")
	if folder == "" {
		folder = "gallery"
	}

	// Validate folder name to prevent injection
	allowedFolders := map[string]bool{
		"gallery":  true,
		"about":    true,
		"carbuild": true,
		"hero":     true,
	}

	if !allowedFolders[folder] {
		json.NewEncoder(w).Encode([]string{})
		return
	}

	// Query database for images
	rows, err := h.db.Query(
		"SELECT id FROM gallery_images WHERE folder = $1 ORDER BY display_order, created_at DESC",
		folder,
	)
	if err != nil {
		json.NewEncoder(w).Encode([]string{})
		return
	}
	defer rows.Close()

	var images []string
	for rows.Next() {
		var id int
		if err := rows.Scan(&id); err != nil {
			continue
		}
		images = append(images, fmt.Sprintf("/api/image/%d", id))
	}

	if images == nil {
		images = []string{}
	}

	json.NewEncoder(w).Encode(images)
}

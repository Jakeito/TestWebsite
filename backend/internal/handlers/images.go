package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
)

func GetImages(w http.ResponseWriter, r *http.Request) {
	folder := r.URL.Query().Get("folder")
	if folder == "" {
		folder = "gallery"
	}

	// Validate folder name to prevent directory traversal
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

	// Determine base images directory (env override for containers)
	baseDir := os.Getenv("IMAGES_DIR")
	if baseDir == "" {
		baseDir = "../frontend/public/images"
	}

	// Read the images directory
	imagesPath := filepath.Join(baseDir, folder)
	files, err := os.ReadDir(imagesPath)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode([]string{})
		return
	}

	var images []string
	validExtensions := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".webp": true,
		".gif":  true,
		".JPG":  true,
		".JPEG": true,
		".PNG":  true,
		".WEBP": true,
		".GIF":  true,
	}

	for _, file := range files {
		if file.IsDir() {
			continue
		}
		ext := filepath.Ext(file.Name())
		if validExtensions[ext] {
			images = append(images, "/images/"+folder+"/"+file.Name())
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(images)
}

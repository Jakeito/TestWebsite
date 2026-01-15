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

	// Try multiple possible paths for the images directory
	possiblePaths := []string{
		"./public/images",           // relative to backend
		"../backend/public/images",  // relative to repo root
		"public/images",             // current directory
	}

	var imagesPath string
	for _, path := range possiblePaths {
		fullPath := filepath.Join(path, folder)
		if _, err := os.Stat(fullPath); err == nil {
			imagesPath = fullPath
			break
		}
	}

	// If no path found, return empty array
	if imagesPath == "" {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode([]string{})
		return
	}
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
			images = append(images, "/public/images/"+folder+"/"+file.Name())
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(images)
}

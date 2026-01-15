package handlers

import (
	"encoding/json"
	"net/http"
)

func GetImages(w http.ResponseWriter, r *http.Request) {
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

	// For now, return empty array
	// Images will be stored in database and can be uploaded via admin panel
	json.NewEncoder(w).Encode([]string{})
}

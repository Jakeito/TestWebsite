package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/Jakeito/TestWebsite/backend/internal/database"
	"github.com/Jakeito/TestWebsite/backend/internal/models"
)

type AboutHandler struct {
	DB *database.DB
}

func NewAboutHandler(db *database.DB) *AboutHandler {
	return &AboutHandler{DB: db}
}

func (h *AboutHandler) GetAboutContent(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query(
		"SELECT id, title, content, image_url, created_at, updated_at FROM about_content ORDER BY created_at DESC",
	)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var contents []models.AboutContent
	for rows.Next() {
		var content models.AboutContent
		var imageURL sql.NullString
		if err := rows.Scan(&content.ID, &content.Title, &content.Content, &imageURL, &content.CreatedAt, &content.UpdatedAt); err != nil {
			http.Error(w, "Error scanning row", http.StatusInternalServerError)
			return
		}
		if imageURL.Valid {
			content.ImageURL = imageURL.String
		}
		contents = append(contents, content)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(contents)
}

func (h *AboutHandler) CreateAboutContent(w http.ResponseWriter, r *http.Request) {
	var content models.AboutContent
	if err := json.NewDecoder(r.Body).Decode(&content); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err := h.DB.QueryRow(
		"INSERT INTO about_content (title, content, image_url) VALUES ($1, $2, $3) RETURNING id, created_at, updated_at",
		content.Title, content.Content, nullString(content.ImageURL),
	).Scan(&content.ID, &content.CreatedAt, &content.UpdatedAt)

	if err != nil {
		http.Error(w, "Error creating content", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(content)
}

func (h *AboutHandler) UpdateAboutContent(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var content models.AboutContent
	if err := json.NewDecoder(r.Body).Decode(&content); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	_, err = h.DB.Exec(
		"UPDATE about_content SET title = $1, content = $2, image_url = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4",
		content.Title, content.Content, nullString(content.ImageURL), id,
	)

	if err != nil {
		http.Error(w, "Error updating content", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Content updated successfully"})
}

func (h *AboutHandler) DeleteAboutContent(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	_, err = h.DB.Exec("DELETE FROM about_content WHERE id = $1", id)
	if err != nil {
		http.Error(w, "Error deleting content", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Content deleted successfully"})
}

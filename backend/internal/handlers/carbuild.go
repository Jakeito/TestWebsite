package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/lib/pq"
	"github.com/Jakeito/TestWebsite/backend/internal/database"
	"github.com/Jakeito/TestWebsite/backend/internal/models"
)

type CarBuildHandler struct {
	DB *database.DB
}

func NewCarBuildHandler(db *database.DB) *CarBuildHandler {
	return &CarBuildHandler{DB: db}
}

func (h *CarBuildHandler) GetCarBuildEntries(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query(
		`SELECT id, title, description, date, category, cost, image_urls, 
		display_order, created_at, updated_at FROM car_build_entries ORDER BY display_order, date DESC`,
	)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var entries []models.CarBuildEntry
	for rows.Next() {
		var entry models.CarBuildEntry
		var category sql.NullString
		var cost sql.NullFloat64
		var imageURLs pq.StringArray
		
		if err := rows.Scan(
			&entry.ID, &entry.Title, &entry.Description, &entry.Date, &category,
			&cost, &imageURLs, &entry.DisplayOrder, &entry.CreatedAt, &entry.UpdatedAt,
		); err != nil {
			http.Error(w, "Error scanning row", http.StatusInternalServerError)
			return
		}

		if category.Valid {
			entry.Category = category.String
		}
		if cost.Valid {
			entry.Cost = &cost.Float64
		}
		if len(imageURLs) > 0 {
			entry.ImageURLs = imageURLs
		}

		entries = append(entries, entry)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(entries)
}

func (h *CarBuildHandler) CreateCarBuildEntry(w http.ResponseWriter, r *http.Request) {
	var entry models.CarBuildEntry
	if err := json.NewDecoder(r.Body).Decode(&entry); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err := h.DB.QueryRow(
		`INSERT INTO car_build_entries (title, description, date, category, cost, image_urls, display_order)
		VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, created_at, updated_at`,
		entry.Title, entry.Description, entry.Date, nullString(entry.Category),
		nullFloat64(entry.Cost), pq.Array(entry.ImageURLs), entry.DisplayOrder,
	).Scan(&entry.ID, &entry.CreatedAt, &entry.UpdatedAt)

	if err != nil {
		http.Error(w, "Error creating car build entry", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(entry)
}

func (h *CarBuildHandler) UpdateCarBuildEntry(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var entry models.CarBuildEntry
	if err := json.NewDecoder(r.Body).Decode(&entry); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	_, err = h.DB.Exec(
		`UPDATE car_build_entries SET title = $1, description = $2, date = $3, category = $4,
		cost = $5, image_urls = $6, display_order = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8`,
		entry.Title, entry.Description, entry.Date, nullString(entry.Category),
		nullFloat64(entry.Cost), pq.Array(entry.ImageURLs), entry.DisplayOrder, id,
	)

	if err != nil {
		http.Error(w, "Error updating car build entry", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Car build entry updated successfully"})
}

func (h *CarBuildHandler) DeleteCarBuildEntry(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	_, err = h.DB.Exec("DELETE FROM car_build_entries WHERE id = $1", id)
	if err != nil {
		http.Error(w, "Error deleting car build entry", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Car build entry deleted successfully"})
}

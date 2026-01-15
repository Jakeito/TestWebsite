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

type ResumeHandler struct {
	DB *database.DB
}

func NewResumeHandler(db *database.DB) *ResumeHandler {
	return &ResumeHandler{DB: db}
}

func (h *ResumeHandler) GetResumeSections(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query(
		`SELECT id, section_type, title, subtitle, description, start_date, end_date, 
		display_order, created_at, updated_at FROM resume_sections ORDER BY display_order, start_date DESC`,
	)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var sections []models.ResumeSection
	for rows.Next() {
		var section models.ResumeSection
		var subtitle, description sql.NullString
		var startDate, endDate sql.NullTime
		
		if err := rows.Scan(
			&section.ID, &section.SectionType, &section.Title, &subtitle, &description,
			&startDate, &endDate, &section.DisplayOrder, &section.CreatedAt, &section.UpdatedAt,
		); err != nil {
			http.Error(w, "Error scanning row", http.StatusInternalServerError)
			return
		}

		if subtitle.Valid {
			section.Subtitle = subtitle.String
		}
		if description.Valid {
			section.Description = description.String
		}
		if startDate.Valid {
			section.StartDate = &startDate.Time
		}
		if endDate.Valid {
			section.EndDate = &endDate.Time
		}

		sections = append(sections, section)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(sections)
}

func (h *ResumeHandler) CreateResumeSection(w http.ResponseWriter, r *http.Request) {
	var section models.ResumeSection
	if err := json.NewDecoder(r.Body).Decode(&section); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err := h.DB.QueryRow(
		`INSERT INTO resume_sections (section_type, title, subtitle, description, start_date, end_date, display_order)
		VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, created_at, updated_at`,
		section.SectionType, section.Title, nullString(section.Subtitle), nullString(section.Description),
		nullTime(section.StartDate), nullTime(section.EndDate), section.DisplayOrder,
	).Scan(&section.ID, &section.CreatedAt, &section.UpdatedAt)

	if err != nil {
		http.Error(w, "Error creating resume section", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(section)
}

func (h *ResumeHandler) UpdateResumeSection(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var section models.ResumeSection
	if err := json.NewDecoder(r.Body).Decode(&section); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	_, err = h.DB.Exec(
		`UPDATE resume_sections SET section_type = $1, title = $2, subtitle = $3, description = $4,
		start_date = $5, end_date = $6, display_order = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8`,
		section.SectionType, section.Title, nullString(section.Subtitle), nullString(section.Description),
		nullTime(section.StartDate), nullTime(section.EndDate), section.DisplayOrder, id,
	)

	if err != nil {
		http.Error(w, "Error updating resume section", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Resume section updated successfully"})
}

func (h *ResumeHandler) DeleteResumeSection(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	_, err = h.DB.Exec("DELETE FROM resume_sections WHERE id = $1", id)
	if err != nil {
		http.Error(w, "Error deleting resume section", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Resume section deleted successfully"})
}

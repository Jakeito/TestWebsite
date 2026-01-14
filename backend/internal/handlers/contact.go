package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/Jakeito/TestWebsite/backend/internal/database"
	"github.com/Jakeito/TestWebsite/backend/internal/models"
)

type ContactHandler struct {
	DB *database.DB
}

func NewContactHandler(db *database.DB) *ContactHandler {
	return &ContactHandler{DB: db}
}

func (h *ContactHandler) SubmitContact(w http.ResponseWriter, r *http.Request) {
	var submission models.ContactSubmission
	if err := json.NewDecoder(r.Body).Decode(&submission); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err := h.DB.QueryRow(
		`INSERT INTO contact_submissions (name, email, subject, message)
		VALUES ($1, $2, $3, $4) RETURNING id, created_at`,
		submission.Name, submission.Email, nullString(submission.Subject), submission.Message,
	).Scan(&submission.ID, &submission.CreatedAt)

	if err != nil {
		http.Error(w, "Error submitting contact form", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":      submission.ID,
		"message": "Contact form submitted successfully",
	})
}

func (h *ContactHandler) GetContactSubmissions(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query(
		`SELECT id, name, email, subject, message, is_read, created_at 
		FROM contact_submissions ORDER BY created_at DESC`,
	)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var submissions []models.ContactSubmission
	for rows.Next() {
		var submission models.ContactSubmission
		var subject sql.NullString
		
		if err := rows.Scan(
			&submission.ID, &submission.Name, &submission.Email, &subject,
			&submission.Message, &submission.IsRead, &submission.CreatedAt,
		); err != nil {
			http.Error(w, "Error scanning row", http.StatusInternalServerError)
			return
		}

		if subject.Valid {
			submission.Subject = subject.String
		}

		submissions = append(submissions, submission)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(submissions)
}

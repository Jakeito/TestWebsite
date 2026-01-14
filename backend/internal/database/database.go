package database

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq"
)

type DB struct {
	*sql.DB
}

func New(connectionString string) (*DB, error) {
	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		return nil, fmt.Errorf("error opening database: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("error connecting to database: %w", err)
	}

	return &DB{db}, nil
}

func (db *DB) RunMigrations(migrationsPath string) error {
	// Create migrations tracking table if it doesn't exist
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version VARCHAR(255) PRIMARY KEY,
			applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`)
	if err != nil {
		return fmt.Errorf("error creating migrations table: %w", err)
	}

	migrationFiles := []string{
		"001_initial_schema.sql",
	}

	for _, file := range migrationFiles {
		// Check if migration already applied
		var exists bool
		err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE version = $1)", file).Scan(&exists)
		if err != nil {
			return fmt.Errorf("error checking migration status: %w", err)
		}

		if exists {
			continue // Skip already applied migrations
		}

		// Read and execute migration
		filePath := fmt.Sprintf("%s/%s", migrationsPath, file)
		content, err := os.ReadFile(filePath)
		if err != nil {
			return fmt.Errorf("error reading migration file %s: %w", file, err)
		}

		if _, err := db.Exec(string(content)); err != nil {
			return fmt.Errorf("error executing migration %s: %w", file, err)
		}

		// Record migration as applied
		if _, err := db.Exec("INSERT INTO schema_migrations (version) VALUES ($1)", file); err != nil {
			return fmt.Errorf("error recording migration %s: %w", file, err)
		}
	}

	return nil
}

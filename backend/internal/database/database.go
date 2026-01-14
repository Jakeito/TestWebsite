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
	migrationFiles := []string{
		"001_initial_schema.sql",
	}

	for _, file := range migrationFiles {
		filePath := fmt.Sprintf("%s/%s", migrationsPath, file)
		content, err := os.ReadFile(filePath)
		if err != nil {
			return fmt.Errorf("error reading migration file %s: %w", file, err)
		}

		if _, err := db.Exec(string(content)); err != nil {
			return fmt.Errorf("error executing migration %s: %w", file, err)
		}
	}

	return nil
}

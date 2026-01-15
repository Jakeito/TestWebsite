package database

import (
	"database/sql"
	"fmt"
	"os"
	"strings"
	"time"

	_ "github.com/lib/pq"
)

type DB struct {
	*sql.DB
}

func New(connectionString string) (*DB, error) {
	var db *sql.DB
	var err error
	
	// Retry connection up to 30 times (60 seconds with 2 second intervals)
	maxRetries := 30
	for attempt := 1; attempt <= maxRetries; attempt++ {
		db, err = sql.Open("postgres", connectionString)
		if err != nil {
			if attempt < maxRetries {
				fmt.Printf("Failed to open database (attempt %d/%d): %v. Retrying in 2 seconds...\n", attempt, maxRetries, err)
				time.Sleep(2 * time.Second)
				continue
			}
			return nil, fmt.Errorf("error opening database: %w", err)
		}

		if err := db.Ping(); err != nil {
			// If database doesn't exist, try to create it
			if strings.Contains(err.Error(), "does not exist") {
				fmt.Printf("Database doesn't exist (attempt %d/%d). Attempting to create it...\n", attempt, maxRetries)
				if createErr := createDatabase(connectionString); createErr == nil {
					// Try to connect again
					db, err = sql.Open("postgres", connectionString)
					if err == nil {
						err = db.Ping()
					}
				} else {
					fmt.Printf("Failed to create database: %v. Retrying...\n", createErr)
					err = createErr
				}
			}
			
			if err != nil {
				db.Close()
				if attempt < maxRetries {
					fmt.Printf("Failed to connect to database (attempt %d/%d): %v. Retrying in 2 seconds...\n", attempt, maxRetries, err)
					time.Sleep(2 * time.Second)
					continue
				}
				return nil, fmt.Errorf("error connecting to database: %w", err)
			}
		}

		// Successfully connected
		fmt.Println("Successfully connected to database")
		return &DB{db}, nil
	}

	return nil, fmt.Errorf("failed to connect to database after %d attempts", maxRetries)
}

// createDatabase attempts to create the target database
func createDatabase(connectionString string) error {
	// Parse the connection string to extract database name
	parts := strings.Split(connectionString, " ")
	var dbName string
	for _, part := range parts {
		if strings.HasPrefix(part, "dbname=") {
			dbName = strings.TrimPrefix(part, "dbname=")
			break
		}
	}
	
	if dbName == "" {
		return fmt.Errorf("could not extract database name from connection string")
	}

	// Connect to default postgres database to create the target database
	adminConnStr := strings.Replace(connectionString, "dbname="+dbName, "dbname=postgres", 1)
	db, err := sql.Open("postgres", adminConnStr)
	if err != nil {
		return fmt.Errorf("error connecting to postgres db: %w", err)
	}
	defer db.Close()

	// Create database
	createSQL := fmt.Sprintf("CREATE DATABASE %s;", dbName)
	if _, err := db.Exec(createSQL); err != nil {
		// If database already exists, that's fine
		if !strings.Contains(err.Error(), "already exists") {
			return fmt.Errorf("error creating database: %w", err)
		}
	}

	return nil
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

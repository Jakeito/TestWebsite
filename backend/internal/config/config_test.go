package config

import (
	"os"
	"testing"
)

func TestLoad(t *testing.T) {
	// Set test environment variables
	os.Setenv("DB_HOST", "testhost")
	os.Setenv("DB_PORT", "5433")
	os.Setenv("JWT_SECRET", "test-secret")
	
	defer func() {
		os.Unsetenv("DB_HOST")
		os.Unsetenv("DB_PORT")
		os.Unsetenv("JWT_SECRET")
	}()
	
	cfg, err := Load()
	if err != nil {
		t.Fatalf("Failed to load config: %v", err)
	}
	
	if cfg.DBHost != "testhost" {
		t.Errorf("Expected DBHost 'testhost', got '%s'", cfg.DBHost)
	}
	
	if cfg.DBPort != "5433" {
		t.Errorf("Expected DBPort '5433', got '%s'", cfg.DBPort)
	}
	
	if cfg.JWTSecret != "test-secret" {
		t.Errorf("Expected JWTSecret 'test-secret', got '%s'", cfg.JWTSecret)
	}
}

func TestDatabaseURL(t *testing.T) {
	cfg := &Config{
		DBHost:     "localhost",
		DBPort:     "5432",
		DBUser:     "testuser",
		DBPassword: "testpass",
		DBName:     "testdb",
		DBSSLMode:  "disable",
	}
	
	expected := "host=localhost port=5432 user=testuser password=testpass dbname=testdb sslmode=disable"
	result := cfg.DatabaseURL()
	
	if result != expected {
		t.Errorf("Expected DatabaseURL '%s', got '%s'", expected, result)
	}
}

func TestGetEnv(t *testing.T) {
	os.Setenv("TEST_VAR", "test-value")
	defer os.Unsetenv("TEST_VAR")
	
	// Test existing variable
	if result := getEnv("TEST_VAR", "default"); result != "test-value" {
		t.Errorf("Expected 'test-value', got '%s'", result)
	}
	
	// Test non-existing variable with default
	if result := getEnv("NON_EXISTING_VAR", "default"); result != "default" {
		t.Errorf("Expected 'default', got '%s'", result)
	}
}

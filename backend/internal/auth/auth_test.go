package auth

import (
	"testing"
)

func TestHashPassword(t *testing.T) {
	password := "testpassword123"
	hash, err := HashPassword(password)
	
	if err != nil {
		t.Fatalf("Failed to hash password: %v", err)
	}
	
	if hash == "" {
		t.Fatal("Hash should not be empty")
	}
	
	if hash == password {
		t.Fatal("Hash should not equal original password")
	}
}

func TestCheckPasswordHash(t *testing.T) {
	password := "testpassword123"
	hash, err := HashPassword(password)
	
	if err != nil {
		t.Fatalf("Failed to hash password: %v", err)
	}
	
	// Test correct password
	if !CheckPasswordHash(password, hash) {
		t.Fatal("CheckPasswordHash should return true for correct password")
	}
	
	// Test incorrect password
	if CheckPasswordHash("wrongpassword", hash) {
		t.Fatal("CheckPasswordHash should return false for incorrect password")
	}
}

func TestGenerateToken(t *testing.T) {
	userID := 1
	email := "test@example.com"
	isAdmin := false
	secret := "test-secret"
	
	token, err := GenerateToken(userID, email, isAdmin, secret)
	
	if err != nil {
		t.Fatalf("Failed to generate token: %v", err)
	}
	
	if token == "" {
		t.Fatal("Token should not be empty")
	}
}

func TestValidateToken(t *testing.T) {
	userID := 1
	email := "test@example.com"
	isAdmin := true
	secret := "test-secret"
	
	token, err := GenerateToken(userID, email, isAdmin, secret)
	if err != nil {
		t.Fatalf("Failed to generate token: %v", err)
	}
	
	// Test valid token
	claims, err := ValidateToken(token, secret)
	if err != nil {
		t.Fatalf("Failed to validate token: %v", err)
	}
	
	if claims.UserID != userID {
		t.Errorf("Expected UserID %d, got %d", userID, claims.UserID)
	}
	
	if claims.Email != email {
		t.Errorf("Expected Email %s, got %s", email, claims.Email)
	}
	
	if claims.IsAdmin != isAdmin {
		t.Errorf("Expected IsAdmin %v, got %v", isAdmin, claims.IsAdmin)
	}
	
	// Test invalid token
	_, err = ValidateToken("invalid-token", secret)
	if err == nil {
		t.Fatal("Expected error for invalid token")
	}
	
	// Test wrong secret
	_, err = ValidateToken(token, "wrong-secret")
	if err == nil {
		t.Fatal("Expected error for wrong secret")
	}
}

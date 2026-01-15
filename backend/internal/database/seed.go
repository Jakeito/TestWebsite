package database

import (
	"log"
	"os"
	"path/filepath"
	"strings"
)

// SeedGalleryImages populates the gallery_images table from the public/images directory
func (db *DB) SeedGalleryImages() error {
	log.Println("Starting image seeding process...")

	// Check if images already exist
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM gallery_images").Scan(&count)
	if err != nil {
		return err
	}

	if count > 0 {
		log.Printf("Gallery already has %d images, skipping seed", count)
		return nil
	}

	folders := []string{"gallery", "about", "carbuild", "hero"}
	baseDir := "./public/images"

	for _, folder := range folders {
		folderPath := filepath.Join(baseDir, folder)

		// Check if folder exists
		info, err := os.Stat(folderPath)
		if err != nil {
			if os.IsNotExist(err) {
				log.Printf("Folder %s does not exist, skipping", folderPath)
				continue
			}
			return err
		}

		if !info.IsDir() {
			continue
		}

		// Read all files in the folder
		files, err := os.ReadDir(folderPath)
		if err != nil {
			log.Printf("Error reading folder %s: %v", folderPath, err)
			continue
		}

		for _, file := range files {
			if file.IsDir() {
				continue
			}

			filename := file.Name()
			// Only process image files
			if !isImageFile(filename) {
				continue
			}

			filePath := filepath.Join(folderPath, filename)
			log.Printf("Seeding image: %s/%s", folder, filename)

			// Read file
			fileData, err := os.ReadFile(filePath)
			if err != nil {
				log.Printf("Error reading file %s: %v", filePath, err)
				continue
			}

			// Determine content type
			contentType := getContentType(filename)

			// Insert into database
			var id int
			err = db.QueryRow(
				"INSERT INTO gallery_images (folder, filename, image_data, content_type) VALUES ($1, $2, $3, $4) RETURNING id",
				folder, filename, fileData, contentType,
			).Scan(&id)

			if err != nil {
				log.Printf("Error inserting image %s: %v", filename, err)
				continue
			}

			log.Printf("Successfully seeded image %s (ID: %d)", filename, id)
		}
	}

	log.Println("Image seeding complete")
	return nil
}

// isImageFile checks if a file is an image
func isImageFile(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	validExts := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".gif":  true,
		".webp": true,
	}
	return validExts[ext]
}

// getContentType returns the MIME type for a file
func getContentType(filename string) string {
	ext := strings.ToLower(filepath.Ext(filename))
	switch ext {
	case ".jpg", ".jpeg":
		return "image/jpeg"
	case ".png":
		return "image/png"
	case ".gif":
		return "image/gif"
	case ".webp":
		return "image/webp"
	default:
		return "image/jpeg"
	}
}

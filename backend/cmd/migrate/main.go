package main

import (
	"log"

	"edu-lms-backend/internal/config"
	"edu-lms-backend/internal/modules/course"
	"edu-lms-backend/internal/pkg/db"
	
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load("backend/.env"); err != nil {
		log.Println("No .env file found")
	}

	cfg := config.LoadConfig()
	db.InitPostgres(cfg)
	database := db.GetDB()

	// Create videos table
	err := database.AutoMigrate(&course.Video{}, &course.Lesson{})
	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	// Drop video_url column from lessons if it exists
	if database.Migrator().HasColumn(&course.Lesson{}, "video_url") {
		err = database.Migrator().DropColumn(&course.Lesson{}, "video_url")
		if err != nil {
			log.Fatalf("Failed to drop video_url column: %v", err)
		}
		log.Println("Dropped video_url column from lessons table")
	}

	log.Println("Migration completed successfully")
}

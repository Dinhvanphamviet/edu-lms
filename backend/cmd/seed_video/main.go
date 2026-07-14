package main

import (
	"log"

	"edu-lms-backend/internal/config"
	"edu-lms-backend/internal/modules/course"
	"edu-lms-backend/internal/pkg/db"
	
	"github.com/google/uuid"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(".env"); err != nil {
		log.Println("No .env file found")
	}

	cfg := config.LoadConfig()
	db.InitPostgres(cfg)
	database := db.GetDB()

	lessonIDStr := "3677420a-5889-4ff4-aec5-6cc8e0c7389b"
	lessonID, err := uuid.Parse(lessonIDStr)
	if err != nil {
		log.Fatalf("Invalid UUID: %v", err)
	}

	// Check if video already exists
	var video course.Video
	if err := database.Where("lesson_id = ?", lessonID).First(&video).Error; err == nil {
		log.Println("Video already exists for this lesson.")
		return
	}

	// Insert mock video. Bunny Stream video ID format is UUID.
	// We'll use a public Bunny Stream test video or just a dummy GUID and see if UI loads it.
	providerVideoID := uuid.New()
	
	newVideo := course.Video{
		LessonID: lessonID,
		Provider: "BUNNY_STREAM",
		ProviderVideoID: providerVideoID,
		Title: "Mock Video",
		Status: "PUBLISHED",
	}

	if err := database.Create(&newVideo).Error; err != nil {
		log.Fatalf("Failed to insert mock video: %v", err)
	}

	log.Println("Successfully inserted mock video for testing.")
}

package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port                   string
	DatabaseURL            string
	JWTSecret              string
	JWTExpiration          string
	RefreshTokenExpiration string
	FrontendURL            string
}

func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found or error loading it, using OS environment variables")
	}

	return &Config{
		Port:                   getEnv("PORT", "8080"),
		DatabaseURL:            getEnv("DATABASE_URL", "host=localhost user=postgres password=postgres dbname=edu_lms port=5432 sslmode=disable TimeZone=Asia/Ho_Chi_Minh"),
		JWTSecret:              getEnv("JWT_SECRET", "supersecretkey"),
		JWTExpiration:          getEnv("JWT_EXPIRATION", "15m"),
		RefreshTokenExpiration: getEnv("REFRESH_TOKEN_EXPIRATION", "168h"), // 7 days
		FrontendURL:            getEnv("FRONTEND_URL", "http://localhost:3000"),
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

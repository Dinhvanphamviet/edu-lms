package main

import (
	"log"
	"net/http"
	"time"

	"edu-lms-backend/internal/config"
	"edu-lms-backend/internal/modules/auth"
	"edu-lms-backend/internal/modules/course"
	"edu-lms-backend/internal/modules/home"
	"edu-lms-backend/internal/modules/teacher"
	"edu-lms-backend/internal/pkg/db"
	"edu-lms-backend/internal/pkg/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Load config
	cfg := config.LoadConfig()

	// 2. Init DB
	db.InitPostgres(cfg)
	database := db.GetDB()

	// 3. Initialize modules
	authRepo := auth.NewRepository(database)
	authService := auth.NewService(authRepo, cfg)
	authHandler := auth.NewHandler(authService, cfg)

	homeRepo := home.NewRepository(database)
	if err := homeRepo.AutoMigrateAndSeed(); err != nil {
		log.Fatalf("Failed to auto migrate and seed home module: %v", err)
	}
	homeService := home.NewService(homeRepo)
	homeHandler := home.NewHandler(homeService)

	courseRepo := course.NewRepository(database)
	if err := courseRepo.AutoMigrateAndSeed(); err != nil {
		log.Fatalf("Failed to auto migrate and seed course module: %v", err)
	}
	courseService := course.NewService(courseRepo)
	courseHandler := course.NewHandler(courseService)


	// 4. Setup Router
	r := gin.Default()

	// 5. Setup CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{cfg.FrontendURL},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// 6. Routes
	apiGroup := r.Group("/api/v1")
	{
		// Health check
		apiGroup.GET("/ping", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "pong from edu-lms-backend"})
		})

		// Auth Routes
		auth.RegisterRoutes(apiGroup, authHandler)

		// Home Routes
		home.RegisterRoutes(apiGroup, homeHandler)

		// Course Routes
		course.RegisterRoutes(apiGroup, courseHandler)

		// Student Routes (Protected)
		studentGroup := apiGroup.Group("/student")
		studentGroup.Use(middleware.RequireAuth(cfg))
		course.RegisterProtectedRoutes(studentGroup, courseHandler)

		// Teacher Routes (Protected + Role)
		teacherGroup := apiGroup.Group("/teacher")
		teacherGroup.Use(middleware.RequireAuth(cfg))
		teacherGroup.Use(middleware.RequireRole("TEACHER", "ADMIN"))
		teacher.RegisterRoutes(teacherGroup, database)

		// Example protected route
		protected := apiGroup.Group("/protected")
		protected.Use(middleware.RequireAuth(cfg))
		{
			protected.GET("/me", authHandler.GetMe)

			// Example role-based route
			adminOnly := protected.Group("/admin")
			adminOnly.Use(middleware.RequireRole("ADMIN"))
			{
				adminOnly.GET("/dashboard", func(c *gin.Context) {
					c.JSON(http.StatusOK, gin.H{"message": "Welcome Admin!"})
				})
			}
		}
	}

	// 7. Start Server
	log.Printf("Starting server on port %s...", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

// Package teacher is the root router for teacher-domain features.
// Each feature lives in its own sub-package (course, curriculum, activation, student, etc.).
// This file wires them all into the /teacher route group.
package teacher

import (
	tcategory "edu-lms-backend/internal/modules/teacher/category"
	tcollection "edu-lms-backend/internal/modules/teacher/collection"
	tcourse "edu-lms-backend/internal/modules/teacher/course"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RegisterRoutes wires all teacher sub-modules into the given router group.
// The router group should already have RequireAuth + RequireRole middleware applied.
func RegisterRoutes(router *gin.RouterGroup, db *gorm.DB) {
	// --- Course management ---
	courseRepo := tcourse.NewRepository(db)
	courseService := tcourse.NewService(courseRepo)
	courseHandler := tcourse.NewHandler(courseService)
	tcourse.RegisterRoutes(router, courseHandler)

	// --- Category management ---
	categoryRepo := tcategory.NewRepository(db)
	categoryService := tcategory.NewService(categoryRepo)
	categoryHandler := tcategory.NewHandler(categoryService)
	tcategory.RegisterRoutes(router, categoryHandler)

	// --- Collection management ---
	collectionRepo := tcollection.NewRepository(db)
	collectionService := tcollection.NewService(collectionRepo)
	collectionHandler := tcollection.NewHandler(collectionService)
	tcollection.RegisterRoutes(router, collectionHandler)

	// --- Future sub-modules ---
	// tcurriculum.RegisterRoutes(router, db)
	// tactivation.RegisterRoutes(router, db)
	// tstudent.RegisterRoutes(router, db)
}

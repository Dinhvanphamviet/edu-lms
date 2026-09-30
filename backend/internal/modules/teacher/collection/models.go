package tcollection

import (
	"time"
)

// TeacherCollectionCourseDTO represents a course within a collection
type TeacherCollectionCourseDTO struct {
	ID         string  `json:"id"`
	Title      string  `json:"title"`
	Slug       string  `json:"slug"`
	Price      float64 `json:"price"`
	CoverImage string  `json:"cover_image"`
	Status     string  `json:"status"`
}

// TeacherCollectionDTO is the DTO returned to frontend for collection listing and detail
type TeacherCollectionDTO struct {
	ID            string                       `json:"id"`
	Title         string                       `json:"title"`
	ShortTitle    string                       `json:"short_title"`
	OriginalPrice float64                      `json:"original_price"`
	SalePrice     float64                      `json:"sale_price"`
	IsActive      bool                         `json:"is_active"`
	TotalLessons  int                          `json:"total_lessons"`
	TotalStudents int                          `json:"total_students"`
	Courses       []TeacherCollectionCourseDTO `json:"courses"`
	CreatedAt     time.Time                    `json:"created_at"`
	UpdatedAt     time.Time                    `json:"updated_at"`
}

// CreateCollectionRequest represents request payload to create a new collection
type CreateCollectionRequest struct {
	Title         string   `json:"title" binding:"required"`
	ShortTitle    string   `json:"short_title"`
	OriginalPrice float64  `json:"original_price"`
	SalePrice     float64  `json:"sale_price"`
	IsActive      *bool    `json:"is_active"`
	CourseIDs     []string `json:"course_ids"`
}

// UpdateCollectionRequest represents request payload to update an existing collection
type UpdateCollectionRequest struct {
	Title         string   `json:"title" binding:"required"`
	ShortTitle    string   `json:"short_title"`
	OriginalPrice float64  `json:"original_price"`
	SalePrice     float64  `json:"sale_price"`
	IsActive      *bool    `json:"is_active"`
	CourseIDs     []string `json:"course_ids"`
}

// UpdateCollectionStatusRequest represents request payload to update active status
type UpdateCollectionStatusRequest struct {
	IsActive bool `json:"is_active"`
}

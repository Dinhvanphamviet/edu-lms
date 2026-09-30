package tcategory

// TeacherCategoryDTO is the DTO returned to frontend for category listing
type TeacherCategoryDTO struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	Slug         string `json:"slug"`
	Type         string `json:"type"`
	Description  string `json:"description"`
	CoursesCount int    `json:"courses_count"`
}

// CreateCategoryRequest is the request body for creating a category
type CreateCategoryRequest struct {
	Name        string  `json:"name" binding:"required"`
	Type        *string `json:"type"`
	Description *string `json:"description"`
}

// UpdateCategoryRequest is the request body for updating a category
type UpdateCategoryRequest struct {
	Name        string  `json:"name" binding:"required"`
	Type        *string `json:"type"`
	Description *string `json:"description"`
}

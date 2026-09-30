package tcourse


// DTO returned to frontend — matches FE CourseItem type
type TeacherCourseDTO struct {
	ID            string  `json:"id"`
	Title         string  `json:"title"`
	Slug          string  `json:"slug"`
	Category      string  `json:"category"`
	Status        string  `json:"status"`
	CoverImage    string  `json:"coverImage"`
	StudentsCount int     `json:"studentsCount"`
	LessonsCount  int     `json:"lessonsCount"`
	DurationHours int     `json:"durationHours"`
	Rating        float64 `json:"rating"`
	UpdatedAt     string  `json:"updatedAt"`
}

// Request DTOs
type CreateCourseRequest struct {
	Title       string   `json:"title" binding:"required"`
	CategoryID  *string  `json:"category_id"`
	Status      string   `json:"status" binding:"required,oneof=DRAFT PUBLISHED HIDDEN"`
	Description *string  `json:"description"`
	Price       *float64 `json:"price"`
	CoverImage  *string  `json:"cover_image"`
	ReleaseDate *string  `json:"release_date"`
	Tags        []string `json:"tags"`
}

type UpdateCourseStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=DRAFT PUBLISHED HIDDEN"`
}

type UpdateCourseRequest struct {
	Title       string   `json:"title" binding:"required"`
	CategoryID  *string  `json:"category_id"`
	Status      string   `json:"status" binding:"required,oneof=DRAFT PUBLISHED HIDDEN"`
	Description *string  `json:"description"`
	Price       *float64 `json:"price"`
	CoverImage  *string  `json:"cover_image"`
	ReleaseDate *string  `json:"release_date"`
	Tags        []string `json:"tags"`
}

type TeacherCourseDetailDTO struct {
	ID           string   `json:"id"`
	Title        string   `json:"title"`
	Slug         string   `json:"slug"`
	Description  string   `json:"description"`
	Price        float64  `json:"price"`
	Status       string   `json:"status"`
	CoverImage   string   `json:"cover_image"`
	ReleaseDate  string   `json:"release_date"`
	Tags         []string `json:"tags"`
	CategoryID   string   `json:"category_id"`
	CategoryName string   `json:"category_name"`
	UpdatedAt    string   `json:"updated_at"`
}

package course

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type CourseStats struct {
	Lessons   int `json:"lessons"`
	Exams     int `json:"exams"`
	Documents int `json:"documents"`
}

type CourseStatus string

const (
	CourseStatusDraft     CourseStatus = "DRAFT"
	CourseStatusPublished CourseStatus = "PUBLISHED"
	CourseStatusHidden    CourseStatus = "HIDDEN"
	CourseStatusArchived  CourseStatus = "ARCHIVED"
)

type Course struct {
	ID           uuid.UUID      `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	Title        string         `gorm:"type:varchar(255);not null" json:"title"`
	Slug         string         `gorm:"type:varchar(255);unique;not null" json:"slug"`
	Description  *string        `gorm:"type:text" json:"description"`
	Price        float64        `gorm:"type:decimal(10,2);default:0" json:"price"`
	DurationDays *int           `gorm:"type:int" json:"duration_days"`
	Status       CourseStatus   `gorm:"type:course_status;not null;default:'DRAFT'" json:"status"`
	CoverImage   *string        `gorm:"type:text" json:"cover_image"`
	ReleaseDate  *time.Time     `gorm:"type:timestamp with time zone" json:"release_date"`
	Tags         pq.StringArray `gorm:"type:text[]" json:"tags"`
	Stats        CourseStats    `gorm:"-" json:"stats"`
	CreatedAt    time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (Course) TableName() string {
	return "courses"
}

type CourseCategory struct {
	ID          uuid.UUID `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	Name        string    `gorm:"type:varchar(255);not null" json:"name"`
	Slug        string    `gorm:"type:varchar(255);unique;not null" json:"slug"`
	Type        *string   `gorm:"type:varchar(50)" json:"type"`
	Description *string   `gorm:"type:text" json:"description"`
}

func (CourseCategory) TableName() string {
	return "course_categories"
}

type CourseCategoryRelation struct {
	CourseID   uuid.UUID `gorm:"primaryKey;type:uuid;not null" json:"course_id"`
	CategoryID uuid.UUID `gorm:"primaryKey;type:uuid;not null" json:"category_id"`
}

func (CourseCategoryRelation) TableName() string {
	return "course_category_relations"
}

type LessonType string

const (
	LessonTypeVideo LessonType = "VIDEO"
	LessonTypePDF   LessonType = "PDF"
	LessonTypeText  LessonType = "TEXT"
	LessonTypeQuiz  LessonType = "QUIZ"
	LessonTypeLive  LessonType = "LIVE"
)

type LessonStatus string

const (
	LessonStatusDraft     LessonStatus = "DRAFT"
	LessonStatusPublished LessonStatus = "PUBLISHED"
	LessonStatusHidden    LessonStatus = "HIDDEN"
	LessonStatusArchived  LessonStatus = "ARCHIVED"
)

type Chapter struct {
	ID        uuid.UUID      `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	CourseID  uuid.UUID      `gorm:"type:uuid;not null" json:"course_id"`
	Title     string         `gorm:"type:varchar(255);not null" json:"title"`
	SortOrder int            `gorm:"type:int;not null;default:0" json:"sort_order"`
	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (Chapter) TableName() string { return "chapters" }

type Lesson struct {
	ID          uuid.UUID      `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	ChapterID   uuid.UUID      `gorm:"type:uuid;not null" json:"chapter_id"`
	Title       string         `gorm:"type:varchar(255);not null" json:"title"`
	Type        LessonType     `gorm:"type:lesson_type;not null" json:"type"`
	SortOrder   int            `gorm:"type:int;not null;default:0" json:"sort_order"`
	Content     *string        `gorm:"type:text" json:"content"`
	VideoURL    *string        `gorm:"type:text" json:"video_url"`
	MaxViews    *int           `gorm:"type:int;default:21" json:"max_views"`
	IsOptional  *bool          `gorm:"type:boolean;default:false" json:"is_optional"`
	Status      LessonStatus   `gorm:"type:lesson_status;not null;default:'DRAFT'" json:"status"`
	CreatedAt   time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (Lesson) TableName() string { return "lessons" }

// DTOs for frontend curriculum

type CurriculumThemeDTO struct {
	ID    string `json:"id"`
	Title string `json:"title"`
	Stats string `json:"stats"`
}

type CurriculumChapterDTO struct {
	ID     string               `json:"id"`
	Title  string               `json:"title"`
	Stats  string               `json:"stats"`
	Themes []CurriculumThemeDTO `json:"themes"`
}


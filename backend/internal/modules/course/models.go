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
	Status       CourseStatus   `gorm:"type:varchar(30);not null;default:'DRAFT'" json:"status"`
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

	Course *Course `gorm:"foreignKey:CourseID" json:"course,omitempty"`
}

func (Chapter) TableName() string { return "chapters" }

type Lesson struct {
	ID         uuid.UUID      `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	ChapterID  uuid.UUID      `gorm:"type:uuid;not null" json:"chapter_id"`
	Title      string         `gorm:"type:varchar(255);not null" json:"title"`
	Type       LessonType     `gorm:"type:varchar(30);not null" json:"type"`
	SortOrder  int            `gorm:"type:int;not null;default:0" json:"sort_order"`
	Content    *string        `gorm:"type:text" json:"content"`
	MaxViews   *int           `gorm:"type:int;default:21" json:"max_views"`
	IsOptional *bool          `gorm:"type:boolean;default:false" json:"is_optional"`
	Status     LessonStatus   `gorm:"type:varchar(30);not null;default:'DRAFT'" json:"status"`
	CreatedAt  time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt  time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	// Relations
	Video       *Video           `gorm:"foreignKey:LessonID" json:"video,omitempty"`
	Chapter     *Chapter         `gorm:"foreignKey:ChapterID" json:"chapter,omitempty"`
	Assessments []Assessment     `gorm:"foreignKey:LessonID" json:"assessments,omitempty"`
	Resources   []LessonResource `gorm:"foreignKey:LessonID" json:"resources,omitempty"`
}

func (Lesson) TableName() string { return "lessons" }

type Video struct {
	ID              uuid.UUID  `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	LessonID        uuid.UUID  `gorm:"type:uuid;unique;not null" json:"lesson_id"`
	Provider        string     `gorm:"type:varchar(30);not null;default:'R2'" json:"provider"`
	ProviderVideoID uuid.UUID  `gorm:"type:uuid;unique;not null" json:"provider_video_id"`
	ObjectKey       *string    `gorm:"type:text" json:"object_key,omitempty"`
	Title           string     `gorm:"type:varchar(255);not null" json:"title"`
	Status          string     `gorm:"type:varchar(30);not null;default:'UPLOADING'" json:"status"`
	DurationSeconds *int       `gorm:"type:int" json:"duration_seconds"`
	ThumbnailURL    *string    `gorm:"type:text" json:"thumbnail_url"`
	CreatedAt       time.Time  `gorm:"autoCreateTime" json:"created_at"`
	ProcessedAt     *time.Time `gorm:"type:timestamp with time zone" json:"processed_at"`
}

func (Video) TableName() string { return "videos" }

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

type CourseProgress struct {
	CompletedLessons int `json:"completed_lessons"`
	TotalLessons     int `json:"total_lessons"`
}

type CourseWithProgressDTO struct {
	ID          string         `json:"id"`
	Title       string         `json:"title"`
	Slug        string         `json:"slug"`
	CoverImage  *string        `json:"cover_image"`
	ReleaseDate *time.Time     `json:"release_date"`
	Tags        pq.StringArray `json:"tags"`
	Stats       CourseStats    `json:"stats"`
	Progress    CourseProgress `json:"progress"`
}

type Assessment struct {
	ID              uuid.UUID `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	LessonID        uuid.UUID `gorm:"type:uuid;not null" json:"lesson_id"`
	Title           string    `gorm:"type:varchar(255);not null" json:"title"`
	DurationMinutes *int      `gorm:"type:int" json:"duration_minutes"`
	MaxAttempts     *int      `gorm:"type:int" json:"max_attempts"`
	PassScore       *int      `gorm:"type:int" json:"pass_score"`
}

func (Assessment) TableName() string { return "assessments" }

type UserLessonProgress struct {
	ID          uuid.UUID `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	UserID      uuid.UUID `gorm:"type:uuid;not null;uniqueIndex:idx_user_lesson" json:"user_id"`
	LessonID    uuid.UUID `gorm:"type:uuid;not null;uniqueIndex:idx_user_lesson" json:"lesson_id"`
	UsedViews   int       `gorm:"type:int;not null;default:0" json:"used_views"`
	IsCompleted bool      `gorm:"type:boolean;default:false" json:"is_completed"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

func (UserLessonProgress) TableName() string { return "user_lesson_progress" }

type LessonResource struct {
	ID           uuid.UUID `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	LessonID     uuid.UUID `gorm:"type:uuid;not null" json:"lesson_id"`
	ResourceName string    `gorm:"type:varchar(255);not null" json:"resource_name"`
	ResourceUrl  string    `gorm:"type:text;not null" json:"resource_url"`
	Type         string    `gorm:"type:varchar(50);not null;default:'PDF'" json:"type"`
}

func (LessonResource) TableName() string { return "lesson_resources" }

type Enrollment struct {
	ID        uuid.UUID  `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	UserID    uuid.UUID  `gorm:"type:uuid;not null" json:"user_id"`
	CourseID  uuid.UUID  `gorm:"type:uuid;not null" json:"course_id"`
	Status    string     `gorm:"type:varchar(30);not null;default:'PENDING'" json:"status"`
	StartDate *time.Time `gorm:"type:timestamptz" json:"start_date"`
	EndDate   *time.Time `gorm:"type:timestamptz" json:"end_date"`
	CreatedAt time.Time  `gorm:"autoCreateTime" json:"created_at"`
}

func (Enrollment) TableName() string { return "enrollments" }

package home

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
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

// Custom type cho JSON array (Tags)
type StringArray []string

func (a *StringArray) Scan(value interface{}) error {
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	return json.Unmarshal(bytes, &a)
}

func (a StringArray) Value() (driver.Value, error) {
	if a == nil {
		return nil, nil
	}
	return json.Marshal(a)
}

// Banner Model
type Banner struct {
	ID        uuid.UUID      `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	ImageURL  string         `gorm:"type:text;not null" json:"image_url"`
	Title     string         `gorm:"type:varchar(255)" json:"title"`
	LinkURL   string         `gorm:"type:text" json:"link_url"`
	SortOrder int            `gorm:"default:0" json:"sort_order"`
	IsActive  bool           `gorm:"default:true" json:"is_active"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
}

func (Banner) TableName() string {
	return "home_banners"
}

// CountdownConfig Model
type CountdownConfig struct {
	ID         uuid.UUID `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	Title      string    `gorm:"type:varchar(255);not null" json:"title"`
	TargetDate time.Time `gorm:"not null" json:"target_date"`
	IsActive   bool      `gorm:"default:true" json:"is_active"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

func (CountdownConfig) TableName() string {
	return "exam_countdowns"
}

// Course Model
type Course struct {
	ID          uuid.UUID      `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"` 
	Title       string         `gorm:"type:varchar(255);not null" json:"title"`
	Slug        string         `gorm:"type:varchar(255);unique;not null" json:"slug"`
	Description string         `gorm:"type:text" json:"description"`
	Price       float64        `gorm:"type:decimal(10,2);default:0" json:"price"`
	DurationDays int           `json:"duration_days"`
	Status      string         `gorm:"type:varchar(50);default:'DRAFT'" json:"status"`
	CoverImage  string         `gorm:"type:text" json:"cover_image"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
	ReleaseDate *time.Time     `gorm:"type:timestamp with time zone" json:"release_date"`
	Tags        pq.StringArray `gorm:"type:text[]" json:"tags"`
	Stats       CourseStats    `gorm:"-" json:"stats"`
}

// CourseCollection Model
type CourseCollection struct {
	ID            uuid.UUID      `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	Title         string         `gorm:"type:varchar(255);not null" json:"title"`
	ShortTitle    string         `gorm:"type:varchar(255)" json:"short_title"`
	OriginalPrice float64        `gorm:"type:decimal(10,2);default:0" json:"original_price"`
	SalePrice     float64        `gorm:"type:decimal(10,2);default:0" json:"sale_price"`
	IsActive      bool           `gorm:"default:true" json:"is_active"`
	Courses       []Course       `gorm:"many2many:collection_courses;joinForeignKey:collection_id;joinReferences:course_id" json:"courses"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
}

func (CourseCollection) TableName() string {
	return "course_collections"
}

// HomeResponse payload
type HomeResponse struct {
	Banners     []Banner           `json:"banners"`
	Countdown   *CountdownConfig   `json:"countdown"`
	Collections []CourseCollection `json:"collections"`
}

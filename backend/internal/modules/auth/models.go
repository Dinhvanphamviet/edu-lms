package auth

import (
	"time"

	"github.com/google/uuid"
)

// Gorm Models mapping to existing DB
type User struct {
	ID           uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Email        string    `gorm:"type:varchar(255);unique;not null"`
	PasswordHash string    `gorm:"type:varchar(255);not null"`
	Role         string    `gorm:"type:user_role;default:'STUDENT';not null"`
	Status       string    `gorm:"type:user_status;default:'ACTIVE';not null"`
	CreatedAt    time.Time `gorm:"autoCreateTime"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime"`

	Profile *UserProfile `gorm:"foreignKey:UserID"`
}

type UserProfile struct {
	UserID    uuid.UUID `gorm:"type:uuid;primaryKey"`
	FullName  string    `gorm:"type:varchar(255);not null"`
	Phone     string    `gorm:"type:varchar(20)"`
	City      string    `gorm:"type:varchar(255)"`
	AvatarURL string    `gorm:"type:text"`
	Bio       string    `gorm:"type:text"`
}

type Session struct {
	ID           uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID       uuid.UUID `gorm:"type:uuid;not null"`
	RefreshToken string    `gorm:"type:varchar(512);unique;not null"`
	ExpiresAt    time.Time `gorm:"not null"`
	CreatedAt    time.Time `gorm:"autoCreateTime"`
	IPAddress    string    `gorm:"type:varchar(45)"`
	UserAgent    string    `gorm:"type:text"`
	IsRevoked    bool      `gorm:"default:false"`
}

// Request / Response structures
type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	FullName string `json:"full_name" binding:"required"`
	Phone    string `json:"phone"`
	City     string `json:"city"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type TokenResponse struct {
	AccessToken string `json:"access_token"`
	User        struct {
		ID       string `json:"id"`
		Email    string `json:"email"`
		Role     string `json:"role"`
		FullName string `json:"full_name"`
	} `json:"user"`
}

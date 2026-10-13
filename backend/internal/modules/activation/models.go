package activation

import (
	"github.com/google/uuid"
	"time"
)

type Code struct {
	ID                  uuid.UUID
	Code                string
	CourseID            uuid.UUID
	MaxUses             int
	UsedCount           int
	Status              string
	CreatedBy           *uuid.UUID
	UsedBy              *uuid.UUID
	UsedAt              *time.Time
	ExpiresAt           *time.Time
	AccessDurationValue *int
	AccessDurationUnit  *string
	CreatedAt           time.Time
	DeletedAt           *time.Time
}

func (Code) TableName() string { return "activation_codes" }

type CourseOption struct {
	ID    uuid.UUID `json:"id"`
	Title string    `json:"title"`
}
type UserInfo struct {
	ID    uuid.UUID `json:"id"`
	Name  string    `json:"name"`
	Email string    `json:"email"`
}
type CodeDTO struct {
	ID                  uuid.UUID      `json:"id"`
	Code                string         `json:"code"`
	Courses             []CourseOption `json:"courses"`
	UsedBy              *UserInfo      `json:"usedBy"`
	UsedAt              *time.Time     `json:"usedAt"`
	ExpiresAt           *time.Time     `json:"expiresAt"`
	AccessDurationValue *int           `json:"accessDurationValue"`
	AccessDurationUnit  *string        `json:"accessDurationUnit"`
	Status              string         `json:"status"`
	DisplayStatus       string         `json:"displayStatus"`
	CreatedAt           time.Time      `json:"createdAt"`
}
type CreateRequest struct {
	CourseIDs           []uuid.UUID `json:"courseIds" binding:"required,min=1,max=100"`
	Quantity            int         `json:"quantity" binding:"required,min=1,max=100"`
	ExpiresAt           *time.Time  `json:"expiresAt"`
	AccessDurationValue *int        `json:"accessDurationValue"`
	AccessDurationUnit  *string     `json:"accessDurationUnit"`
}
type ActivateRequest struct {
	Code string `json:"code" binding:"required,max=50"`
}
type ActivateResponse struct {
	Success         bool           `json:"success"`
	Message         string         `json:"message"`
	Courses         []CourseOption `json:"courses"`
	Code            string         `json:"code"`
	ActivatedAt     time.Time      `json:"activatedAt"`
	AccessExpiresAt *time.Time     `json:"accessExpiresAt"`
}

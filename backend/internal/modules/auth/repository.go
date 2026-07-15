package auth

import (
	"errors"

	"gorm.io/gorm"
)

type Repository interface {
	CreateUser(user *User) error
	FindUserByEmail(email string) (*User, error)
	FindUserByID(id string) (*User, error)
	CreateSession(session *Session) error
	FindSessionByToken(token string) (*Session, error)
	RevokeSession(token string) error
	GetEnrolledCourseSlugs(userID string) ([]string, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) CreateUser(user *User) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(user).Error; err != nil {
			return err
		}
		return nil
	})
}

func (r *repository) FindUserByEmail(email string) (*User, error) {
	var user User
	err := r.db.Preload("Profile").Where("email = ?", email).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *repository) FindUserByID(id string) (*User, error) {
	var user User
	err := r.db.Preload("Profile").Where("id = ?", id).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *repository) CreateSession(session *Session) error {
	return r.db.Create(session).Error
}

func (r *repository) FindSessionByToken(token string) (*Session, error) {
	var session Session
	err := r.db.Where("refresh_token = ?", token).First(&session).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &session, nil
}

func (r *repository) RevokeSession(token string) error {
	return r.db.Model(&Session{}).Where("refresh_token = ?", token).Update("is_revoked", true).Error
}

func (r *repository) GetEnrolledCourseSlugs(userID string) ([]string, error) {
	var slugs []string
	err := r.db.Table("courses c").
		Select("c.slug").
		Joins("JOIN enrollments e ON c.id = e.course_id").
		Where("e.user_id = ? AND e.status = ?", userID, "ACTIVE").
		Pluck("c.slug", &slugs).Error
	return slugs, err
}

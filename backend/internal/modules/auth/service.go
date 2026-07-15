package auth

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"time"

	"edu-lms-backend/internal/config"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type Service interface {
	Register(req RegisterRequest) (*User, error)
	Login(req LoginRequest, ip, userAgent string) (*TokenResponse, string, error)
	RefreshToken(token string, ip, userAgent string) (*TokenResponse, string, error)
	Logout(token string) error
	GetMe(userID string) (*UserMeResponse, error)
}

type service struct {
	repo Repository
	cfg  *config.Config
}

func NewService(repo Repository, cfg *config.Config) Service {
	return &service{repo, cfg}
}

func (s *service) Register(req RegisterRequest) (*User, error) {
	existingUser, err := s.repo.FindUserByEmail(req.Email)
	if err != nil {
		return nil, err
	}
	if existingUser != nil {
		return nil, errors.New("email already exists")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &User{
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
		Role:         "STUDENT",
		Status:       "ACTIVE",
		Profile: &UserProfile{
			FullName: req.FullName,
			Phone:    req.Phone,
			City:     req.City,
		},
	}

	if err := s.repo.CreateUser(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *service) Login(req LoginRequest, ip, userAgent string) (*TokenResponse, string, error) {
	user, err := s.repo.FindUserByEmail(req.Email)
	if err != nil {
		return nil, "", err
	}
	if user == nil {
		return nil, "", errors.New("invalid email or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, "", errors.New("invalid email or password")
	}

	if user.Status != "ACTIVE" {
		return nil, "", errors.New("account is not active")
	}

	return s.generateTokens(user, ip, userAgent)
}

func (s *service) RefreshToken(token string, ip, userAgent string) (*TokenResponse, string, error) {
	session, err := s.repo.FindSessionByToken(token)
	if err != nil {
		return nil, "", err
	}
	if session == nil || session.IsRevoked || session.ExpiresAt.Before(time.Now()) {
		return nil, "", errors.New("invalid or expired refresh token")
	}

	user, err := s.repo.FindUserByID(session.UserID.String())
	if err != nil || user == nil {
		return nil, "", errors.New("user not found")
	}

	if user.Status != "ACTIVE" {
		return nil, "", errors.New("account is not active")
	}

	// Revoke old session to prevent reuse (Refresh Token Rotation)
	_ = s.repo.RevokeSession(token)

	return s.generateTokens(user, ip, userAgent)
}

func (s *service) Logout(token string) error {
	return s.repo.RevokeSession(token)
}

func (s *service) generateTokens(user *User, ip, userAgent string) (*TokenResponse, string, error) {
	// Parse durations
	accessDuration, _ := time.ParseDuration(s.cfg.JWTExpiration)
	if accessDuration == 0 {
		accessDuration = 15 * time.Minute
	}
	refreshDuration, _ := time.ParseDuration(s.cfg.RefreshTokenExpiration)
	if refreshDuration == 0 {
		refreshDuration = 168 * time.Hour
	}

	// Create Access Token
	claims := jwt.MapClaims{
		"sub":   user.ID.String(),
		"email": user.Email,
		"role":  user.Role,
		"exp":   time.Now().Add(accessDuration).Unix(),
		"iat":   time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	accessToken, err := token.SignedString([]byte(s.cfg.JWTSecret))
	if err != nil {
		return nil, "", err
	}

	// Create Refresh Token (Opaque Token)
	b := make([]byte, 32)
	_, _ = rand.Read(b)
	refreshToken := base64.URLEncoding.EncodeToString(b)

	// Save Session
	session := &Session{
		UserID:       user.ID,
		RefreshToken: refreshToken,
		ExpiresAt:    time.Now().Add(refreshDuration),
		IPAddress:    ip,
		UserAgent:    userAgent,
		IsRevoked:    false,
	}
	if err := s.repo.CreateSession(session); err != nil {
		return nil, "", err
	}

	fullName := ""
	if user.Profile != nil {
		fullName = user.Profile.FullName
	}

	enrolledCourses, _ := s.repo.GetEnrolledCourseSlugs(user.ID.String())
	if enrolledCourses == nil {
		enrolledCourses = []string{}
	}

	res := &TokenResponse{
		AccessToken: accessToken,
	}
	res.User.ID = user.ID.String()
	res.User.Email = user.Email
	res.User.Role = user.Role
	res.User.FullName = fullName
	res.User.EnrolledCourses = enrolledCourses

	return res, refreshToken, nil
}

func (s *service) GetMe(userID string) (*UserMeResponse, error) {
	user, err := s.repo.FindUserByID(userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("user not found")
	}

	enrolledCourses, _ := s.repo.GetEnrolledCourseSlugs(userID)
	if enrolledCourses == nil {
		enrolledCourses = []string{}
	}

	fullName := ""
	if user.Profile != nil {
		fullName = user.Profile.FullName
	}

	return &UserMeResponse{
		ID:              user.ID.String(),
		Email:           user.Email,
		Role:            user.Role,
		FullName:        fullName,
		EnrolledCourses: enrolledCourses,
	}, nil
}

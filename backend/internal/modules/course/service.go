package course

import (
	"errors"
	"os"
	"strconv"

	"edu-lms-backend/internal/pkg/bunny"
)

type Service interface {
	GetCategories() ([]CourseCategory, error)
	GetCourses(categorySlug string) ([]Course, error)
	GetCourseBySlug(slug string) (*Course, error)
	GetCourseCurriculum(slug string) ([]CurriculumChapterDTO, error)
	GetLessonByID(lessonID string) (*Lesson, error)
	GetLessonPlayback(userID string, lessonID string) (map[string]interface{}, error)
	CheckEnrollmentStatus(userID string, courseSlug string) (bool, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetCategories() ([]CourseCategory, error) {
	return s.repo.GetCategories()
}

func (s *service) GetCourses(categorySlug string) ([]Course, error) {
	return s.repo.GetCourses(categorySlug)
}

func (s *service) GetCourseBySlug(slug string) (*Course, error) {
	return s.repo.GetCourseBySlug(slug)
}

func (s *service) GetCourseCurriculum(slug string) ([]CurriculumChapterDTO, error) {
	course, err := s.repo.GetCourseBySlug(slug)
	if err != nil {
		return nil, err
	}
	return s.repo.GetCourseCurriculum(course.ID)
}

func (s *service) GetLessonByID(lessonID string) (*Lesson, error) {
	return s.repo.GetLessonByID(lessonID)
}

func (s *service) GetLessonPlayback(userID string, lessonID string) (map[string]interface{}, error) {
	video, err := s.repo.GetVideoByLessonID(lessonID)
	if err != nil {
		return nil, err
	}

	lesson, err := s.repo.GetLessonByID(lessonID)
	var maxViews int = 21
	if err == nil && lesson.MaxViews != nil {
		maxViews = *lesson.MaxViews
	}

	// Fetch or Create Progress and Increment Views
	progress, err := s.repo.IncrementLessonViews(userID, lessonID)
	if err != nil {
		return nil, err
	}

	// Check if exceeded
	if progress.UsedViews > maxViews {
		return map[string]interface{}{
			"maxViews":  maxViews,
			"usedViews": progress.UsedViews,
		}, errors.New("MAX_VIEWS_EXCEEDED")
	}

	cdnHostname := os.Getenv("BUNNY_STREAM_CDN_HOSTNAME")
	if cdnHostname == "" {
		cdnHostname = "video.mathflow.vn"
	}
	tokenKey := os.Getenv("BUNNY_STREAM_TOKEN_KEY")
	if tokenKey == "" {
		tokenKey = "dummy-token-key"
	}
	
	expiresIn := 3600 // 1 hour
	if envExp := os.Getenv("BUNNY_STREAM_TOKEN_EXPIRES_IN"); envExp != "" {
		if exp, err := strconv.Atoi(envExp); err == nil {
			expiresIn = exp
		}
	}

	playbackUrl := bunny.GeneratePlaybackURL(cdnHostname, video.ProviderVideoID.String(), tokenKey, expiresIn)

	return map[string]interface{}{
		"providerVideoId": video.ProviderVideoID.String(),
		"playbackUrl":     playbackUrl,
		"maxViews":        maxViews,
		"usedViews":       progress.UsedViews,
	}, nil
}

func (s *service) CheckEnrollmentStatus(userID string, courseSlug string) (bool, error) {
	// First get the course by slug to get its ID
	course, err := s.repo.GetCourseBySlug(courseSlug)
	if err != nil {
		return false, err
	}

	// Then check enrollment
	enrolled, err := s.repo.CheckEnrollment(userID, course.ID.String())
	if err != nil {
		return false, err
	}

	return enrolled, nil
}

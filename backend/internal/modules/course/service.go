package course

import (
	"context"
	"errors"
	"os"
	"strconv"
	"strings"

	"edu-lms-backend/internal/pkg/bunny"
	"edu-lms-backend/internal/pkg/r2"
)

type Service interface {
	GetCategories() ([]CourseCategory, error)
	GetCourses(categorySlug string) ([]Course, error)
	GetCourseBySlug(slug string) (*Course, error)
	GetCourseCurriculum(slug string) ([]CurriculumChapterDTO, error)
	GetLessonByID(lessonID string) (*Lesson, error)
	GetLessonPlayback(userID string, lessonID string) (map[string]interface{}, error)
	CheckEnrollmentStatus(userID string, courseSlug string) (bool, error)
	GetEnrolledCourses(userID string) ([]CourseWithProgressDTO, error)
	MarkLessonAsCompleted(userID, lessonID string) error
	GetLessonProgress(userID, lessonID string) (*UserLessonProgress, error)
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
	allowed, err := s.repo.CanPlayLesson(userID, lessonID)
	if err != nil {
		return nil, err
	}
	if !allowed {
		return nil, errors.New("ENROLLMENT_REQUIRED")
	}
	video, err := s.repo.GetVideoByLessonID(lessonID)
	if err != nil {
		return nil, err
	}

	lesson, err := s.repo.GetLessonByID(lessonID)
	if err != nil {
		return nil, err
	}
	maxViews := 21
	if lesson.MaxViews != nil {
		maxViews = *lesson.MaxViews
	}

	// Resolve the provider before consuming a view (invalid configuration must not cost a view).
	playbackUrl, contentType, err := videoPlaybackURL(video)
	if err != nil {
		return nil, err
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

	return map[string]interface{}{
		"providerVideoId": video.ProviderVideoID.String(),
		"provider":        playbackProvider(video),
		"contentType":     contentType,
		"playbackUrl":     playbackUrl,
		"maxViews":        maxViews,
		"usedViews":       progress.UsedViews,
		"isCompleted":     progress.IsCompleted,
	}, nil
}

// Prefer an attached R2 file while retaining the legacy Bunny ID and provider.
func playbackProvider(video *Video) string {
	if video.ObjectKey != nil && strings.TrimSpace(*video.ObjectKey) != "" {
		return "R2"
	}
	if video.Provider == "" {
		return "BUNNY_STREAM"
	}
	return video.Provider
}

func videoPlaybackURL(video *Video) (string, string, error) {
	provider := playbackProvider(video)
	if provider == "R2" {
		if video.ObjectKey == nil {
			return "", "", errors.New("R2 object key is missing")
		}
		client, err := r2.NewFromEnv()
		if err != nil {
			return "", "", err
		}
		url, err := client.PlaybackURL(context.Background(), *video.ObjectKey)
		return url, "video/mp4", err
	}
	if provider != "BUNNY_STREAM" {
		return "", "", errors.New("unsupported video provider")
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

	return playbackUrl, "application/x-mpegURL", nil
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

func (s *service) GetEnrolledCourses(userID string) ([]CourseWithProgressDTO, error) {
	return s.repo.GetEnrolledCoursesWithProgress(userID)
}

func (s *service) MarkLessonAsCompleted(userID, lessonID string) error {
	return s.repo.MarkLessonAsCompleted(userID, lessonID)
}

func (s *service) GetLessonProgress(userID, lessonID string) (*UserLessonProgress, error) {
	return s.repo.GetLessonProgress(userID, lessonID)
}

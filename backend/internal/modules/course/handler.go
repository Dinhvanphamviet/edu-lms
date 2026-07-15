package course

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) GetCategories(c *gin.Context) {
	categories, err := h.service.GetCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    categories,
	})
}

func (h *Handler) GetCourses(c *gin.Context) {
	categorySlug := c.Query("category")
	
	courses, err := h.service.GetCourses(categorySlug)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch courses"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    courses,
	})
}

func (h *Handler) GetCourseBySlug(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing course slug"})
		return
	}

	course, err := h.service.GetCourseBySlug(slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    course,
	})
}

func (h *Handler) GetCourseCurriculum(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing course slug"})
		return
	}

	curriculum, err := h.service.GetCourseCurriculum(slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course curriculum not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    curriculum,
	})
}

func (h *Handler) GetLessonPlayback(c *gin.Context) {
	lessonID := c.Param("id")
	if lessonID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing lesson ID"})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	playbackInfo, err := h.service.GetLessonPlayback(userID.(string), lessonID)
	if err != nil {
		if err.Error() == "MAX_VIEWS_EXCEEDED" {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Bạn đã hết lượt xem cho bài giảng này",
				"data":  playbackInfo,
			})
			return
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "Playback information not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    playbackInfo,
	})
}

func (h *Handler) GetLessonByID(c *gin.Context) {
	lessonID := c.Param("id")
	if lessonID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing lesson ID"})
		return
	}

	lesson, err := h.service.GetLessonByID(lessonID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Lesson not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    lesson,
	})
}

func (h *Handler) GetEnrollmentStatus(c *gin.Context) {
	courseSlug := c.Param("slug")
	if courseSlug == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing course slug"})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	enrolled, err := h.service.CheckEnrollmentStatus(userID.(string), courseSlug)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check enrollment status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data": map[string]interface{}{
			"enrolled": enrolled,
		},
	})
}

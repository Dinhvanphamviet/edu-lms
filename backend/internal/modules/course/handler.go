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

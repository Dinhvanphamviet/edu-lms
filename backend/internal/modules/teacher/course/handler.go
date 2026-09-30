package tcourse

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

func (h *Handler) GetTeacherCourses(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	courses, err := h.service.GetTeacherCourses(userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch teacher courses"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    courses,
	})
}

func (h *Handler) CreateCourse(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var req CreateCourseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	course, err := h.service.CreateCourse(req, userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create course"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "success",
		"data":    course,
	})
}

func (h *Handler) UpdateCourseStatus(c *gin.Context) {
	courseID := c.Param("id")
	if courseID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing course ID"})
		return
	}

	var req UpdateCourseStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.UpdateCourseStatus(courseID, req.Status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update course status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
	})
}

func (h *Handler) GetCourseDetail(c *gin.Context) {
	courseID := c.Param("id")
	if courseID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing course ID"})
		return
	}

	course, err := h.service.GetCourseByID(courseID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    course,
	})
}

func (h *Handler) UpdateCourse(c *gin.Context) {
	courseID := c.Param("id")
	if courseID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing course ID"})
		return
	}

	var req UpdateCourseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updated, err := h.service.UpdateCourse(courseID, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update course: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    updated,
	})
}


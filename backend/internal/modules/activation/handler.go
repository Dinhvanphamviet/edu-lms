package activation

import (
	"errors"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Handler struct{ service *Service }

func NewHandler(service *Service) *Handler { return &Handler{service: service} }
func actorID(c *gin.Context) (uuid.UUID, bool) {
	id, err := uuid.Parse(c.GetString("userID"))
	if err != nil || id == uuid.Nil {
		c.JSON(401, gin.H{"error": "Phiên đăng nhập không hợp lệ."})
		return uuid.Nil, false
	}
	return id, true
}
func writeError(c *gin.Context, err error) {
	var apiErr *APIError
	if errors.As(err, &apiErr) {
		c.JSON(apiErr.Status, gin.H{"error": apiErr.Message})
		return
	}
	log.Printf("activation request failed: %v", err)
	c.JSON(500, gin.H{"error": "Không thể xử lý mã kích hoạt. Vui lòng thử lại."})
}
func (h *Handler) List(c *gin.Context) {
	actor, ok := actorID(c)
	if !ok {
		return
	}
	items, err := h.service.List(c.Request.Context(), actor)
	if err != nil {
		writeError(c, err)
		return
	}
	c.JSON(200, gin.H{"data": items})
}
func (h *Handler) Create(c *gin.Context) {
	actor, ok := actorID(c)
	if !ok {
		return
	}
	var req CreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Dữ liệu tạo mã không hợp lệ."})
		return
	}
	items, err := h.service.Create(c.Request.Context(), actor, req)
	if err != nil {
		writeError(c, err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": items})
}
func (h *Handler) change(c *gin.Context, remove bool) {
	actor, ok := actorID(c)
	if !ok {
		return
	}
	id, err := uuid.Parse(c.Param("id"))
	if err != nil || id == uuid.Nil {
		c.JSON(400, gin.H{"error": "ID mã không hợp lệ."})
		return
	}
	item, err := h.service.Change(c.Request.Context(), actor, id, remove)
	if err != nil {
		writeError(c, err)
		return
	}
	if remove {
		c.JSON(200, gin.H{"message": "Đã xóa mã chưa sử dụng."})
		return
	}
	c.JSON(200, gin.H{"data": item})
}
func (h *Handler) Toggle(c *gin.Context) { h.change(c, false) }
func (h *Handler) Delete(c *gin.Context) { h.change(c, true) }
func (h *Handler) Activate(c *gin.Context) {
	actor, ok := actorID(c)
	if !ok {
		return
	}
	var req ActivateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Vui lòng nhập mã kích hoạt hợp lệ."})
		return
	}
	result, err := h.service.Activate(c.Request.Context(), actor, req.Code)
	if err != nil {
		writeError(c, err)
		return
	}
	c.JSON(200, gin.H{"data": result})
}
func RegisterTeacherRoutes(router *gin.RouterGroup, handler *Handler) {
	router.GET("/activation-codes", handler.List)
	router.POST("/activation-codes", handler.Create)
	router.PATCH("/activation-codes/:id/toggle", handler.Toggle)
	router.DELETE("/activation-codes/:id", handler.Delete)
}
func RegisterStudentRoutes(router *gin.RouterGroup, handler *Handler) {
	router.POST("/activation-codes/activate", handler.Activate)
}

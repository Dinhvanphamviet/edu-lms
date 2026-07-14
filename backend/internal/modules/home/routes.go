package home

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.RouterGroup, h *Handler) {
	publicGroup := r.Group("/public")
	{
		publicGroup.GET("/home", h.GetHomeData)
	}
}

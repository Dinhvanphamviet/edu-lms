package tcategory

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.RouterGroup, handler *Handler) {
	categories := router.Group("/categories")
	{
		categories.GET("", handler.GetCategories)
		categories.POST("", handler.CreateCategory)
		categories.PUT("/:id", handler.UpdateCategory)
		categories.DELETE("/:id", handler.DeleteCategory)
	}
}

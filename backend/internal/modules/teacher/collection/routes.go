package tcollection

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.RouterGroup, handler *Handler) {
	collections := router.Group("/collections")
	{
		collections.GET("", handler.GetCollections)
		collections.GET("/:id", handler.GetCollectionByID)
		collections.POST("", handler.CreateCollection)
		collections.PUT("/:id", handler.UpdateCollection)
		collections.PATCH("/:id/status", handler.UpdateCollectionStatus)
		collections.DELETE("/:id", handler.DeleteCollection)
	}
}

package course

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.RouterGroup, handler *Handler) {
	public := router.Group("/public")
	{
		public.GET("/categories", handler.GetCategories)
		public.GET("/courses", handler.GetCourses)
		public.GET("/courses/:slug", handler.GetCourseBySlug)
		public.GET("/courses/:slug/curriculum", handler.GetCourseCurriculum)
	}
}

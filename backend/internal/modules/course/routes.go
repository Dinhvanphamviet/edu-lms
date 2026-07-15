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
		public.GET("/lessons/:id", handler.GetLessonByID)
	}
}

func RegisterProtectedRoutes(router *gin.RouterGroup, handler *Handler) {
	router.GET("/lessons/:id/playback", handler.GetLessonPlayback)
	router.GET("/courses/:slug/enrollment-status", handler.GetEnrollmentStatus)
}

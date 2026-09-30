package tcourse

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.RouterGroup, handler *Handler) {
	courses := router.Group("/courses")
	{
		courses.GET("", handler.GetTeacherCourses)
		courses.POST("", handler.CreateCourse)
		courses.GET("/:id", handler.GetCourseDetail)
		courses.PUT("/:id", handler.UpdateCourse)
		courses.PATCH("/:id/status", handler.UpdateCourseStatus)
	}
}

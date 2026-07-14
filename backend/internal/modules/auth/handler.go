package auth

import (
	"net/http"
	"time"

	"edu-lms-backend/internal/config"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service Service
	cfg     *config.Config
}

func NewHandler(service Service, cfg *config.Config) *Handler {
	return &Handler{service, cfg}
}

func (h *Handler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.service.Register(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully",
		"user_id": user.ID,
	})
}

func (h *Handler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ip := c.ClientIP()
	userAgent := c.GetHeader("User-Agent")

	res, refreshToken, err := h.service.Login(req, ip, userAgent)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	h.setRefreshTokenCookie(c, refreshToken)

	c.JSON(http.StatusOK, res)
}

func (h *Handler) Refresh(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil || refreshToken == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "missing refresh token"})
		return
	}

	ip := c.ClientIP()
	userAgent := c.GetHeader("User-Agent")

	res, newRefreshToken, err := h.service.RefreshToken(refreshToken, ip, userAgent)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	h.setRefreshTokenCookie(c, newRefreshToken)

	c.JSON(http.StatusOK, res)
}

func (h *Handler) Logout(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err == nil && refreshToken != "" {
		_ = h.service.Logout(refreshToken)
	}

	// Clear cookie
	c.SetCookie("refresh_token", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

func (h *Handler) setRefreshTokenCookie(c *gin.Context, token string) {
	refreshDuration, _ := time.ParseDuration(h.cfg.RefreshTokenExpiration)
	if refreshDuration == 0 {
		refreshDuration = 168 * time.Hour
	}

	// In production, set Secure=true. For local dev, false is fine if not https.
	secure := false
	if h.cfg.FrontendURL != "http://localhost:3000" {
		secure = true
	}

	c.SetCookie("refresh_token", token, int(refreshDuration.Seconds()), "/", "", secure, true)
}

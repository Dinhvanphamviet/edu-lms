package bunny

import (
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"net/url"
	"strings"
	"time"
)

// GenerateBunnyToken generates a HMAC-SHA256 token for Bunny Stream
func GenerateBunnyToken(securityKey, path string, expirationTime time.Time) string {
	// Path example: /<video-guid>/*
	
	// The standard Bunny CDN URL signature requires:
	// hashableBase = securityKey + path + expires
	// In Bunny Stream, usually token auth for HLS is enabled on the Pull Zone.
	// The path should be something like "/*" or "/guid/*"
	
	expires := fmt.Sprintf("%d", expirationTime.Unix())
	
	hashableBase := securityKey + path + expires
	
	hasher := sha256.New()
	hasher.Write([]byte(hashableBase))
	hash := hasher.Sum(nil)
	
	// Convert to Base64 and make it URL safe
	token := base64.StdEncoding.EncodeToString(hash)
	token = strings.ReplaceAll(token, "\n", "")
	token = strings.ReplaceAll(token, "+", "-")
	token = strings.ReplaceAll(token, "/", "_")
	token = strings.ReplaceAll(token, "=", "")
	
	return token
}

// GeneratePlaybackURL creates the full playback URL with token
func GeneratePlaybackURL(hostname, videoGuid, securityKey string, expiresInSeconds int) string {
	expirationTime := time.Now().Add(time.Duration(expiresInSeconds) * time.Second)
	
	// For Bunny Stream, the path to secure usually is the video directory
	// Path to sign: /video_guid/*
	pathToSign := fmt.Sprintf("/%s/*", videoGuid)
	
	token := GenerateBunnyToken(securityKey, pathToSign, expirationTime)
	
	// URL format: https://<hostname>/<video_guid>/playlist.m3u8?token_path=...&expires=...&token=...
	// Or simpler Bunny Stream format: https://<hostname>/<video_guid>/playlist.m3u8?token=<token>&expires=<expires>
	
	expiresStr := fmt.Sprintf("%d", expirationTime.Unix())
	
	// Ensure hostname has no trailing slash
	hostname = strings.TrimRight(hostname, "/")
	
	playbackUrl := fmt.Sprintf("https://%s/%s/playlist.m3u8?token=%s&expires=%s", 
		hostname, 
		videoGuid, 
		url.QueryEscape(token), 
		expiresStr)
		
	return playbackUrl
}

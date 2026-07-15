package bunny

import (
	"fmt"
	"strings"
)

// GeneratePlaybackURL creates the full playback URL with token
func GeneratePlaybackURL(hostname, videoGuid, securityKey string, expiresInSeconds int) string {
	// Ensure hostname has no trailing slash
	hostname = strings.TrimRight(hostname, "/")
	
	// The raw URL for the playlist
	rawUrl := fmt.Sprintf("https://%s/%s/playlist.m3u8", hostname, videoGuid)
	
	// The path we are allowing is the directory path
	pathAllowed := fmt.Sprintf("/%s/", videoGuid)
	
	// SignUrl returns the signed URL
	signedUrl, err := SignUrl(
		rawUrl,
		securityKey,
		int64(expiresInSeconds),
		"", // userIp
		true, // isDirectory
		pathAllowed, // pathAllowed
		"", // countriesAllowed
		"", // countriesBlocked
		false, // ignoreParams
		nil, // expiresAt
		0, // speedLimit
	)
	
	if err != nil {
		// Fallback to rawUrl if there's an error signing (shouldn't happen with valid inputs)
		return rawUrl
	}
	
	return signedUrl
}

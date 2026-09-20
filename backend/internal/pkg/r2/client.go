package r2

import (
	"context"
	"errors"
	"net/url"
	"os"
	"path"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type Client struct {
	S3     *s3.Client
	Bucket string
}

func NewFromEnv() (*Client, error) {
	endpoint, key, secret, bucket := os.Getenv("R2_ENDPOINT"), os.Getenv("R2_ACCESS_KEY_ID"), os.Getenv("R2_SECRET_ACCESS_KEY"), os.Getenv("R2_BUCKET_NAME")
	u, err := url.Parse(endpoint)
	if err != nil || u.Scheme != "https" || u.Host == "" || key == "" || secret == "" || bucket == "" {
		return nil, errors.New("R2 configuration is incomplete or invalid")
	}
	return &Client{S3: s3.New(s3.Options{
		Region: "auto", BaseEndpoint: aws.String(endpoint), UsePathStyle: true,
		Credentials: credentials.NewStaticCredentialsProvider(key, secret, ""),
	}), Bucket: bucket}, nil
}

func ValidateKey(key string) error {
	if strings.TrimSpace(key) == "" || strings.HasPrefix(key, "/") || strings.Contains(key, "://") || strings.ToLower(path.Ext(key)) != ".mp4" {
		return errors.New("R2 video must be an MP4 object key, for example courses/lesson-1.mp4")
	}
	return nil
}

func (c *Client) PlaybackURL(ctx context.Context, key string) (string, error) {
	if err := ValidateKey(key); err != nil {
		return "", err
	}
	result, err := s3.NewPresignClient(c.S3).PresignGetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(c.Bucket), Key: aws.String(key),
		ResponseContentType:        aws.String("video/mp4"),
		ResponseContentDisposition: aws.String("inline"),
	}, func(o *s3.PresignOptions) { o.Expires = 4 * time.Hour })
	if err != nil {
		return "", errors.New("could not sign R2 playback URL")
	}
	return result.URL, nil
}

func (c *Client) CheckObject(ctx context.Context, key string) error {
	if err := ValidateKey(key); err != nil {
		return err
	}
	_, err := c.S3.HeadObject(ctx, &s3.HeadObjectInput{Bucket: aws.String(c.Bucket), Key: aws.String(key)})
	if err != nil {
		return errors.New("R2 video not found or inaccessible")
	}
	return nil
}

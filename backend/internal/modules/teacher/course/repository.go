package tcourse

import (
	"fmt"
	"math"
	"strings"
	"time"
	"unicode"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Repository interface {
	GetTeacherCourses(teacherID string) ([]TeacherCourseDTO, error)
	GetCourseByID(courseID string) (*TeacherCourseDetailDTO, error)
	CreateCourse(req CreateCourseRequest, teacherID string) (*TeacherCourseDTO, error)
	UpdateCourse(courseID string, req UpdateCourseRequest) (*TeacherCourseDetailDTO, error)
	UpdateCourseStatus(courseID string, status string) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) GetTeacherCourses(teacherID string) ([]TeacherCourseDTO, error) {
	type rawRow struct {
		ID                   string    `gorm:"column:id"`
		Title                string    `gorm:"column:title"`
		Slug                 string    `gorm:"column:slug"`
		Status               string    `gorm:"column:status"`
		CoverImage           *string   `gorm:"column:cover_image"`
		UpdatedAt            time.Time `gorm:"column:updated_at"`
		Category             string    `gorm:"column:category"`
		StudentsCount        int       `gorm:"column:students_count"`
		LessonsCount         int       `gorm:"column:lessons_count"`
		TotalDurationSeconds int       `gorm:"column:total_duration_seconds"`
	}

	var rows []rawRow
	err := r.db.Raw(`
		SELECT 
			c.id, c.title, c.slug, c.status, c.cover_image, c.updated_at,
			COALESCE(cat.name, '') AS category,
			COALESCE(enroll_stats.cnt, 0) AS students_count,
			COALESCE(lesson_stats.cnt, 0) AS lessons_count,
			COALESCE(dur_stats.total_seconds, 0) AS total_duration_seconds
		FROM courses c
		LEFT JOIN LATERAL (
			SELECT cc.name FROM course_category_relations ccr 
			JOIN course_categories cc ON cc.id = ccr.category_id 
			WHERE ccr.course_id = c.id LIMIT 1
		) cat ON true
		LEFT JOIN LATERAL (
			SELECT COUNT(*) AS cnt FROM enrollments e 
			WHERE e.course_id = c.id AND e.status IN ('ACTIVE','PENDING')
		) enroll_stats ON true
		LEFT JOIN LATERAL (
			SELECT COUNT(*) AS cnt FROM lessons l 
			JOIN chapters ch ON l.chapter_id = ch.id 
			WHERE ch.course_id = c.id AND l.deleted_at IS NULL AND ch.deleted_at IS NULL
		) lesson_stats ON true
		LEFT JOIN LATERAL (
			SELECT COALESCE(SUM(v.duration_seconds), 0) AS total_seconds FROM videos v
			JOIN lessons l ON v.lesson_id = l.id
			JOIN chapters ch ON l.chapter_id = ch.id
			WHERE ch.course_id = c.id AND l.deleted_at IS NULL AND ch.deleted_at IS NULL
		) dur_stats ON true
		WHERE c.deleted_at IS NULL
		ORDER BY c.updated_at DESC
	`).Scan(&rows).Error

	if err != nil {
		return nil, err
	}

	dtos := make([]TeacherCourseDTO, 0, len(rows))
	for _, row := range rows {
		coverImage := ""
		if row.CoverImage != nil {
			coverImage = *row.CoverImage
		}
		dtos = append(dtos, TeacherCourseDTO{
			ID:            row.ID,
			Title:         row.Title,
			Slug:          row.Slug,
			Category:      row.Category,
			Status:        row.Status,
			CoverImage:    coverImage,
			StudentsCount: row.StudentsCount,
			LessonsCount:  row.LessonsCount,
			DurationHours: int(math.Ceil(float64(row.TotalDurationSeconds) / 3600)),
			Rating:        0,
			UpdatedAt:     row.UpdatedAt.Format("02/01/2006"),
		})
	}

	return dtos, nil
}

func (r *repository) CreateCourse(req CreateCourseRequest, teacherID string) (*TeacherCourseDTO, error) {
	slug := generateSlug(req.Title)

	var resultDTO TeacherCourseDTO

	err := r.db.Transaction(func(tx *gorm.DB) error {
		now := time.Now()

		price := float64(0)
		if req.Price != nil && *req.Price >= 0 {
			price = *req.Price
		}

		var releaseDate *time.Time
		if req.ReleaseDate != nil && *req.ReleaseDate != "" {
			if t, err := time.Parse("2006-01-02", *req.ReleaseDate); err == nil {
				releaseDate = &t
			} else if t2, err2 := time.Parse(time.RFC3339, *req.ReleaseDate); err2 == nil {
				releaseDate = &t2
			}
		}
		if releaseDate == nil {
			releaseDate = &now
		}

		coverImage := "https://images.unsplash.com/photo-1633613286991-611fe299c4be?q=80&w=600&auto=format&fit=crop"
		if req.CoverImage != nil && strings.TrimSpace(*req.CoverImage) != "" {
			coverImage = strings.TrimSpace(*req.CoverImage)
		}

		tags := req.Tags
		if len(tags) == 0 {
			tags = []string{"Video"}
		}

		type CourseRow struct {
			ID          uuid.UUID      `gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
			Title       string
			Slug        string
			Description *string
			Price       float64
			Status      string
			CoverImage  string
			ReleaseDate *time.Time
			Tags        pq.StringArray `gorm:"type:text[]"`
			CreatedAt   time.Time
			UpdatedAt   time.Time
		}

		courseRow := CourseRow{
			ID:          uuid.New(),
			Title:       req.Title,
			Slug:        slug,
			Description: req.Description,
			Price:       price,
			Status:      req.Status,
			CoverImage:  coverImage,
			ReleaseDate: releaseDate,
			Tags:        pq.StringArray(tags),
			CreatedAt:   now,
			UpdatedAt:   now,
		}

		if err := tx.Table("courses").Create(&courseRow).Error; err != nil {
			if strings.Contains(err.Error(), "duplicate") || strings.Contains(err.Error(), "unique") {
				courseRow.Slug = slug + "-" + courseRow.ID.String()[:8]
				if err2 := tx.Table("courses").Create(&courseRow).Error; err2 != nil {
					return err2
				}
			} else {
				return err
			}
		}

		if req.CategoryID != nil && *req.CategoryID != "" {
			catUID, parseErr := uuid.Parse(*req.CategoryID)
			if parseErr == nil {
				type CatRel struct {
					CourseID   uuid.UUID `gorm:"primaryKey"`
					CategoryID uuid.UUID `gorm:"primaryKey"`
				}
				if err := tx.Table("course_category_relations").Create(&CatRel{
					CourseID:   courseRow.ID,
					CategoryID: catUID,
				}).Error; err != nil {
					return err
				}
			}
		}

		categoryName := ""
		if req.CategoryID != nil && *req.CategoryID != "" {
			tx.Raw("SELECT name FROM course_categories WHERE id = ?", *req.CategoryID).Scan(&categoryName)
		}

		resultDTO = TeacherCourseDTO{
			ID:            courseRow.ID.String(),
			Title:         courseRow.Title,
			Slug:          courseRow.Slug,
			Category:      categoryName,
			Status:        courseRow.Status,
			CoverImage:    courseRow.CoverImage,
			StudentsCount: 0,
			LessonsCount:  0,
			DurationHours: 0,
			Rating:        0,
			UpdatedAt:     now.Format("02/01/2006"),
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return &resultDTO, nil
}

func (r *repository) GetCourseByID(courseID string) (*TeacherCourseDetailDTO, error) {
	type courseRaw struct {
		ID           string         `gorm:"column:id"`
		Title        string         `gorm:"column:title"`
		Slug         string         `gorm:"column:slug"`
		Description  *string        `gorm:"column:description"`
		Price        float64        `gorm:"column:price"`
		Status       string         `gorm:"column:status"`
		CoverImage   *string        `gorm:"column:cover_image"`
		ReleaseDate  *time.Time     `gorm:"column:release_date"`
		Tags         pq.StringArray `gorm:"column:tags"`
		CategoryID   *string        `gorm:"column:category_id"`
		CategoryName *string        `gorm:"column:category_name"`
		UpdatedAt    time.Time      `gorm:"column:updated_at"`
	}

	var row courseRaw
	err := r.db.Raw(`
		SELECT 
			c.id, c.title, c.slug, c.description, c.price,
			c.status, c.cover_image, c.release_date, c.tags, c.updated_at,
			cat.id AS category_id,
			cat.name AS category_name
		FROM courses c
		LEFT JOIN LATERAL (
			SELECT cc.id, cc.name FROM course_category_relations ccr
			JOIN course_categories cc ON cc.id = ccr.category_id
			WHERE ccr.course_id = c.id
			LIMIT 1
		) cat ON true
		WHERE c.id = ? AND c.deleted_at IS NULL
	`, courseID).Scan(&row).Error

	if err != nil {
		return nil, err
	}
	if row.ID == "" {
		return nil, fmt.Errorf("course not found")
	}

	desc := ""
	if row.Description != nil {
		desc = *row.Description
	}
	cover := ""
	if row.CoverImage != nil {
		cover = *row.CoverImage
	}
	releaseStr := ""
	if row.ReleaseDate != nil {
		releaseStr = row.ReleaseDate.Format("2006-01-02")
	}
	catID := ""
	if row.CategoryID != nil {
		catID = *row.CategoryID
	}
	catName := ""
	if row.CategoryName != nil {
		catName = *row.CategoryName
	}

	return &TeacherCourseDetailDTO{
		ID:           row.ID,
		Title:        row.Title,
		Slug:         row.Slug,
		Description:  desc,
		Price:        row.Price,
		Status:       row.Status,
		CoverImage:   cover,
		ReleaseDate:  releaseStr,
		Tags:         []string(row.Tags),
		CategoryID:   catID,
		CategoryName: catName,
		UpdatedAt:    row.UpdatedAt.Format("02/01/2006"),
	}, nil
}

func (r *repository) UpdateCourse(courseID string, req UpdateCourseRequest) (*TeacherCourseDetailDTO, error) {
	cUID, err := uuid.Parse(courseID)
	if err != nil {
		return nil, fmt.Errorf("invalid course id")
	}

	err = r.db.Transaction(func(tx *gorm.DB) error {
		updates := map[string]interface{}{
			"title":      req.Title,
			"status":     req.Status,
			"updated_at": time.Now(),
		}

		if req.Description != nil {
			updates["description"] = *req.Description
		}
		if req.Price != nil {
			updates["price"] = *req.Price
		}
		if req.CoverImage != nil && strings.TrimSpace(*req.CoverImage) != "" {
			updates["cover_image"] = strings.TrimSpace(*req.CoverImage)
		}
		if req.ReleaseDate != nil && *req.ReleaseDate != "" {
			if t, err := time.Parse("2006-01-02", *req.ReleaseDate); err == nil {
				updates["release_date"] = t
			}
		}
		if req.Tags != nil {
			updates["tags"] = pq.StringArray(req.Tags)
		}

		res := tx.Table("courses").Where("id = ? AND deleted_at IS NULL", cUID).Updates(updates)
		if res.Error != nil {
			return res.Error
		}
		if res.RowsAffected == 0 {
			return fmt.Errorf("course not found")
		}

		// Update category relation
		if req.CategoryID != nil {
			tx.Exec("DELETE FROM course_category_relations WHERE course_id = ?", cUID)
			if *req.CategoryID != "" {
				catUID, parseErr := uuid.Parse(*req.CategoryID)
				if parseErr == nil {
					type CatRel struct {
						CourseID   uuid.UUID `gorm:"primaryKey"`
						CategoryID uuid.UUID `gorm:"primaryKey"`
					}
					tx.Table("course_category_relations").Create(&CatRel{
						CourseID:   cUID,
						CategoryID: catUID,
					})
				}
			}
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return r.GetCourseByID(courseID)
}

func (r *repository) UpdateCourseStatus(courseID string, status string) error {
	result := r.db.Table("courses").Where("id = ? AND deleted_at IS NULL", courseID).Update("status", status)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return fmt.Errorf("course not found")
	}
	return nil
}

func generateSlug(title string) string {
	lower := strings.ToLower(title)

	replacements := map[rune]string{
		'á': "a", 'à': "a", 'ả': "a", 'ã': "a", 'ạ': "a",
		'ă': "a", 'ắ': "a", 'ằ': "a", 'ẳ': "a", 'ẵ': "a", 'ặ': "a",
		'â': "a", 'ấ': "a", 'ầ': "a", 'ẩ': "a", 'ẫ': "a", 'ậ': "a",
		'é': "e", 'è': "e", 'ẻ': "e", 'ẽ': "e", 'ẹ': "e",
		'ê': "e", 'ế': "e", 'ề': "e", 'ể': "e", 'ễ': "e", 'ệ': "e",
		'í': "i", 'ì': "i", 'ỉ': "i", 'ĩ': "i", 'ị': "i",
		'ó': "o", 'ò': "o", 'ỏ': "o", 'õ': "o", 'ọ': "o",
		'ô': "o", 'ố': "o", 'ồ': "o", 'ổ': "o", 'ỗ': "o", 'ộ': "o",
		'ơ': "o", 'ớ': "o", 'ờ': "o", 'ở': "o", 'ỡ': "o", 'ợ': "o",
		'ú': "u", 'ù': "u", 'ủ': "u", 'ũ': "u", 'ụ': "u",
		'ư': "u", 'ứ': "u", 'ừ': "u", 'ử': "u", 'ữ': "u", 'ự': "u",
		'ý': "y", 'ỳ': "y", 'ỷ': "y", 'ỹ': "y", 'ỵ': "y",
		'đ': "d",
	}

	var b strings.Builder
	for _, r := range lower {
		if repl, ok := replacements[r]; ok {
			b.WriteString(repl)
		} else if unicode.IsLetter(r) || unicode.IsDigit(r) {
			b.WriteRune(r)
		} else {
			b.WriteRune(' ')
		}
	}

	parts := strings.Fields(b.String())
	slug := strings.Join(parts, "-")
	if len(slug) > 200 {
		slug = slug[:200]
	}
	return slug
}

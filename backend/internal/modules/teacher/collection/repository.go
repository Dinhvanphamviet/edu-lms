package tcollection

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	GetCollections() ([]TeacherCollectionDTO, error)
	GetCollectionByID(id string) (*TeacherCollectionDTO, error)
	CreateCollection(req CreateCollectionRequest) (*TeacherCollectionDTO, error)
	UpdateCollection(id string, req UpdateCollectionRequest) (*TeacherCollectionDTO, error)
	UpdateCollectionStatus(id string, isActive bool) error
	DeleteCollection(id string) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

// CourseCollectionRow matches table course_collections
type CourseCollectionRow struct {
	ID            uuid.UUID `gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	Title         string    `gorm:"type:varchar(255);not null"`
	ShortTitle    *string   `gorm:"type:varchar(255)"`
	OriginalPrice float64   `gorm:"type:decimal(10,2);default:0"`
	SalePrice     float64   `gorm:"type:decimal(10,2);default:0"`
	IsActive      bool      `gorm:"default:true"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

func (CourseCollectionRow) TableName() string {
	return "course_collections"
}

func (r *repository) populateCollectionDetails(col CourseCollectionRow) TeacherCollectionDTO {
	shortTitle := ""
	if col.ShortTitle != nil {
		shortTitle = *col.ShortTitle
	}

	dto := TeacherCollectionDTO{
		ID:            col.ID.String(),
		Title:         col.Title,
		ShortTitle:    shortTitle,
		OriginalPrice: col.OriginalPrice,
		SalePrice:     col.SalePrice,
		IsActive:      col.IsActive,
		CreatedAt:     col.CreatedAt,
		UpdatedAt:     col.UpdatedAt,
		Courses:       make([]TeacherCollectionCourseDTO, 0),
	}

	// 1. Fetch courses in this collection
	type courseRaw struct {
		ID         string  `gorm:"column:id"`
		Title      string  `gorm:"column:title"`
		Slug       string  `gorm:"column:slug"`
		Price      float64 `gorm:"column:price"`
		CoverImage *string `gorm:"column:cover_image"`
		Status     string  `gorm:"column:status"`
	}

	var courses []courseRaw
	err := r.db.Raw(`
		SELECT c.id, c.title, c.slug, COALESCE(c.price, 0) as price, c.cover_image, c.status
		FROM courses c
		JOIN collection_courses cc ON c.id = cc.course_id
		WHERE cc.collection_id = ? AND c.deleted_at IS NULL
		ORDER BY c.created_at ASC
	`, col.ID).Scan(&courses).Error

	if err == nil {
		for _, c := range courses {
			cover := ""
			if c.CoverImage != nil {
				cover = *c.CoverImage
			}
			dto.Courses = append(dto.Courses, TeacherCollectionCourseDTO{
				ID:         c.ID,
				Title:      c.Title,
				Slug:       c.Slug,
				Price:      c.Price,
				CoverImage: cover,
				Status:     c.Status,
			})
		}
	}

	// 2. Compute total lessons dynamically
	var totalLessons int
	r.db.Raw(`
		SELECT COUNT(l.id)
		FROM lessons l
		JOIN chapters ch ON l.chapter_id = ch.id
		JOIN collection_courses cc ON cc.course_id = ch.course_id
		WHERE cc.collection_id = ?
		  AND l.deleted_at IS NULL AND ch.deleted_at IS NULL
	`, col.ID).Scan(&totalLessons)
	dto.TotalLessons = totalLessons

	// 3. Compute total unique active students enrolled
	var totalStudents int
	r.db.Raw(`
		SELECT COUNT(DISTINCT e.user_id)
		FROM enrollments e
		JOIN collection_courses cc ON cc.course_id = e.course_id
		WHERE cc.collection_id = ? AND e.status = 'ACTIVE'
	`, col.ID).Scan(&totalStudents)
	dto.TotalStudents = totalStudents

	return dto
}

func (r *repository) GetCollections() ([]TeacherCollectionDTO, error) {
	var rows []CourseCollectionRow
	err := r.db.Order("created_at DESC").Find(&rows).Error
	if err != nil {
		return nil, err
	}

	result := make([]TeacherCollectionDTO, 0, len(rows))
	for _, row := range rows {
		result = append(result, r.populateCollectionDetails(row))
	}

	return result, nil
}

func (r *repository) GetCollectionByID(id string) (*TeacherCollectionDTO, error) {
	colUID, err := uuid.Parse(id)
	if err != nil {
		return nil, fmt.Errorf("invalid collection id")
	}

	var row CourseCollectionRow
	if err := r.db.Where("id = ?", colUID).First(&row).Error; err != nil {
		return nil, fmt.Errorf("collection not found")
	}

	dto := r.populateCollectionDetails(row)
	return &dto, nil
}

func (r *repository) CreateCollection(req CreateCollectionRequest) (*TeacherCollectionDTO, error) {
	colID := uuid.New()
	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}

	var shortTitle *string
	if req.ShortTitle != "" {
		shortTitle = &req.ShortTitle
	}

	row := CourseCollectionRow{
		ID:            colID,
		Title:         req.Title,
		ShortTitle:    shortTitle,
		OriginalPrice: req.OriginalPrice,
		SalePrice:     req.SalePrice,
		IsActive:      isActive,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	err := r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&row).Error; err != nil {
			return err
		}

		for _, courseIDStr := range req.CourseIDs {
			courseUID, err := uuid.Parse(courseIDStr)
			if err != nil {
				continue
			}

			if err := tx.Exec(`
				INSERT INTO collection_courses (collection_id, course_id)
				VALUES (?, ?)
				ON CONFLICT DO NOTHING
			`, colID, courseUID).Error; err != nil {
				return err
			}
		}
		return nil
	})

	if err != nil {
		return nil, err
	}

	return r.GetCollectionByID(colID.String())
}

func (r *repository) UpdateCollection(id string, req UpdateCollectionRequest) (*TeacherCollectionDTO, error) {
	colUID, err := uuid.Parse(id)
	if err != nil {
		return nil, fmt.Errorf("invalid collection id")
	}

	err = r.db.Transaction(func(tx *gorm.DB) error {
		updates := map[string]interface{}{
			"title":          req.Title,
			"original_price": req.OriginalPrice,
			"sale_price":     req.SalePrice,
			"updated_at":     time.Now(),
		}

		if req.ShortTitle != "" {
			updates["short_title"] = req.ShortTitle
		} else {
			updates["short_title"] = nil
		}

		if req.IsActive != nil {
			updates["is_active"] = *req.IsActive
		}

		res := tx.Table("course_collections").Where("id = ?", colUID).Updates(updates)
		if res.Error != nil {
			return res.Error
		}
		if res.RowsAffected == 0 {
			return fmt.Errorf("collection not found")
		}

		// Update course relations if provided
		if req.CourseIDs != nil {
			if err := tx.Exec("DELETE FROM collection_courses WHERE collection_id = ?", colUID).Error; err != nil {
				return err
			}

			for _, courseIDStr := range req.CourseIDs {
				courseUID, err := uuid.Parse(courseIDStr)
				if err != nil {
					continue
				}
				if err := tx.Exec(`
					INSERT INTO collection_courses (collection_id, course_id)
					VALUES (?, ?)
					ON CONFLICT DO NOTHING
				`, colUID, courseUID).Error; err != nil {
					return err
				}
			}
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return r.GetCollectionByID(id)
}

func (r *repository) UpdateCollectionStatus(id string, isActive bool) error {
	colUID, err := uuid.Parse(id)
	if err != nil {
		return fmt.Errorf("invalid collection id")
	}

	res := r.db.Table("course_collections").Where("id = ?", colUID).Updates(map[string]interface{}{
		"is_active":  isActive,
		"updated_at": time.Now(),
	})
	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected == 0 {
		return fmt.Errorf("collection not found")
	}
	return nil
}

func (r *repository) DeleteCollection(id string) error {
	colUID, err := uuid.Parse(id)
	if err != nil {
		return fmt.Errorf("invalid collection id")
	}

	return r.db.Transaction(func(tx *gorm.DB) error {
		// Clean up relation table first
		if err := tx.Exec("DELETE FROM collection_courses WHERE collection_id = ?", colUID).Error; err != nil {
			return err
		}

		res := tx.Exec("DELETE FROM course_collections WHERE id = ?", colUID)
		if res.Error != nil {
			return res.Error
		}
		if res.RowsAffected == 0 {
			return fmt.Errorf("collection not found")
		}
		return nil
	})
}

package tcategory

import (
	"fmt"
	"strings"
	"unicode"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	GetCategories() ([]TeacherCategoryDTO, error)
	CreateCategory(req CreateCategoryRequest) (*TeacherCategoryDTO, error)
	UpdateCategory(categoryID string, req UpdateCategoryRequest) (*TeacherCategoryDTO, error)
	DeleteCategory(categoryID string) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	// Normalize legacy English types in course_categories table to Vietnamese
	db.Exec("UPDATE course_categories SET type = 'Khối lớp' WHERE UPPER(type) = 'GRADE'")
	db.Exec("UPDATE course_categories SET type = 'Mục tiêu' WHERE UPPER(type) = 'GOAL'")
	db.Exec("UPDATE course_categories SET type = 'Môn học' WHERE UPPER(type) = 'SUBJECT'")
	db.Exec("UPDATE course_categories SET type = 'Định dạng' WHERE UPPER(type) = 'FORMAT'")
	return &repository{db: db}
}

func normalizeType(t *string) *string {
	if t == nil {
		return nil
	}
	trimmed := strings.TrimSpace(*t)
	switch strings.ToUpper(trimmed) {
	case "GRADE":
		res := "Khối lớp"
		return &res
	case "GOAL":
		res := "Mục tiêu"
		return &res
	case "SUBJECT":
		res := "Môn học"
		return &res
	case "FORMAT":
		res := "Định dạng"
		return &res
	case "TOPIC":
		res := "Chuyên đề"
		return &res
	case "EXAM_PREP":
		res := "Kỳ thi"
		return &res
	default:
		return &trimmed
	}
}

func (r *repository) GetCategories() ([]TeacherCategoryDTO, error) {
	type rawRow struct {
		ID           string  `gorm:"column:id"`
		Name         string  `gorm:"column:name"`
		Slug         string  `gorm:"column:slug"`
		Type         *string `gorm:"column:type"`
		Description  *string `gorm:"column:description"`
		CoursesCount int     `gorm:"column:courses_count"`
	}

	var rows []rawRow
	err := r.db.Raw(`
		SELECT 
			cc.id, cc.name, cc.slug, cc.type, cc.description,
			COALESCE(rel.cnt, 0) AS courses_count
		FROM course_categories cc
		LEFT JOIN LATERAL (
			SELECT COUNT(*) AS cnt 
			FROM course_category_relations ccr
			WHERE ccr.category_id = cc.id
		) rel ON true
		ORDER BY cc.name ASC
	`).Scan(&rows).Error

	if err != nil {
		return nil, err
	}

	dtos := make([]TeacherCategoryDTO, 0, len(rows))
	for _, row := range rows {
		normType := normalizeType(row.Type)
		typ := ""
		if normType != nil {
			typ = *normType
		}
		desc := ""
		if row.Description != nil {
			desc = *row.Description
		}
		dtos = append(dtos, TeacherCategoryDTO{
			ID:           row.ID,
			Name:         row.Name,
			Slug:         row.Slug,
			Type:         typ,
			Description:  desc,
			CoursesCount: row.CoursesCount,
		})
	}

	return dtos, nil
}

func (r *repository) CreateCategory(req CreateCategoryRequest) (*TeacherCategoryDTO, error) {
	slug := generateSlug(req.Name)

	type CategoryRow struct {
		ID          uuid.UUID `gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
		Name        string
		Slug        string
		Type        *string
		Description *string
	}

	normType := normalizeType(req.Type)
	row := CategoryRow{
		ID:          uuid.New(),
		Name:        req.Name,
		Slug:        slug,
		Type:        normType,
		Description: req.Description,
	}

	if err := r.db.Table("course_categories").Create(&row).Error; err != nil {
		if strings.Contains(err.Error(), "duplicate") || strings.Contains(err.Error(), "unique") {
			row.Slug = slug + "-" + row.ID.String()[:8]
			if err2 := r.db.Table("course_categories").Create(&row).Error; err2 != nil {
				return nil, err2
			}
		} else {
			return nil, err
		}
	}

	typ := ""
	if row.Type != nil {
		typ = *row.Type
	}
	desc := ""
	if row.Description != nil {
		desc = *row.Description
	}

	return &TeacherCategoryDTO{
		ID:           row.ID.String(),
		Name:         row.Name,
		Slug:         row.Slug,
		Type:         typ,
		Description:  desc,
		CoursesCount: 0,
	}, nil
}

func (r *repository) UpdateCategory(categoryID string, req UpdateCategoryRequest) (*TeacherCategoryDTO, error) {
	catUID, err := uuid.Parse(categoryID)
	if err != nil {
		return nil, fmt.Errorf("invalid category id")
	}

	updates := map[string]interface{}{
		"name": req.Name,
		"slug": generateSlug(req.Name),
	}
	if req.Type != nil {
		normType := normalizeType(req.Type)
		if normType != nil {
			updates["type"] = *normType
		} else {
			updates["type"] = nil
		}
	}
	if req.Description != nil {
		updates["description"] = *req.Description
	}

	res := r.db.Table("course_categories").Where("id = ?", catUID).Updates(updates)
	if res.Error != nil {
		return nil, res.Error
	}
	if res.RowsAffected == 0 {
		return nil, fmt.Errorf("category not found")
	}

	// Re-fetch with courses count
	type rawRow struct {
		ID           string  `gorm:"column:id"`
		Name         string  `gorm:"column:name"`
		Slug         string  `gorm:"column:slug"`
		Type         *string `gorm:"column:type"`
		Description  *string `gorm:"column:description"`
		CoursesCount int     `gorm:"column:courses_count"`
	}

	var row rawRow
	err = r.db.Raw(`
		SELECT 
			cc.id, cc.name, cc.slug, cc.type, cc.description,
			COALESCE(rel.cnt, 0) AS courses_count
		FROM course_categories cc
		LEFT JOIN LATERAL (
			SELECT COUNT(*) AS cnt 
			FROM course_category_relations ccr
			WHERE ccr.category_id = cc.id
		) rel ON true
		WHERE cc.id = ?
	`, catUID).Scan(&row).Error

	if err != nil {
		return nil, err
	}

	typ := ""
	if row.Type != nil {
		typ = *row.Type
	}
	desc := ""
	if row.Description != nil {
		desc = *row.Description
	}

	return &TeacherCategoryDTO{
		ID:           row.ID,
		Name:         row.Name,
		Slug:         row.Slug,
		Type:         typ,
		Description:  desc,
		CoursesCount: row.CoursesCount,
	}, nil
}

func (r *repository) DeleteCategory(categoryID string) error {
	catUID, err := uuid.Parse(categoryID)
	if err != nil {
		return fmt.Errorf("invalid category id")
	}

	return r.db.Transaction(func(tx *gorm.DB) error {
		// Remove relations first
		if err := tx.Exec("DELETE FROM course_category_relations WHERE category_id = ?", catUID).Error; err != nil {
			return err
		}
		// Delete category
		res := tx.Exec("DELETE FROM course_categories WHERE id = ?", catUID)
		if res.Error != nil {
			return res.Error
		}
		if res.RowsAffected == 0 {
			return fmt.Errorf("category not found")
		}
		return nil
	})
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

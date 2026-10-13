package activation

import (
	"context"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) *Repository { return &Repository{db: db} }
func coursesForCode(tx *gorm.DB, id uuid.UUID) ([]CourseOption, error) {
	items := []CourseOption{}
	err := tx.Table("activation_code_courses acc").Select("c.id, c.title").
		Joins("JOIN courses c ON c.id = acc.course_id").
		Where("acc.code_id = ?", id).Order("acc.sort_order, c.id").Scan(&items).Error
	return items, err
}

func toDTO(tx *gorm.DB, code Code) (CodeDTO, error) {
	courses, err := coursesForCode(tx, code.ID)
	if err != nil {
		return CodeDTO{}, err
	}
	dto := CodeDTO{ID: code.ID, Code: code.Code, Courses: courses, UsedAt: code.UsedAt,
		ExpiresAt: code.ExpiresAt, Status: code.Status, CreatedAt: code.CreatedAt}
	dto.AccessDurationValue, dto.AccessDurationUnit = code.AccessDurationValue, code.AccessDurationUnit
	switch {
	case code.UsedCount > 0 || code.UsedAt != nil:
		dto.Status, dto.DisplayStatus = "USED", "USED"
	case code.Status == "DISABLED":
		dto.DisplayStatus = "DISABLED"
	case code.ExpiresAt != nil && !code.ExpiresAt.After(time.Now()):
		dto.DisplayStatus = "EXPIRED"
	default:
		dto.DisplayStatus = "UNUSED"
	}
	if code.UsedBy != nil {
		var info UserInfo
		if err := tx.Table("users u").Select("u.id, u.email, COALESCE(p.full_name, '') AS name").
			Joins("LEFT JOIN user_profiles p ON p.user_id = u.id").Where("u.id = ?", *code.UsedBy).Scan(&info).Error; err != nil {
			return CodeDTO{}, err
		}
		dto.UsedBy = &info
	}
	return dto, nil
}

func (r *Repository) List(ctx context.Context, actor uuid.UUID, admin bool) ([]CodeDTO, error) {
	tx := r.db.WithContext(ctx)
	query := tx.Where("deleted_at IS NULL")
	if !admin {
		query = query.Where("created_by = ?", actor)
	}
	var codes []Code
	if err := query.Order("created_at DESC, id").Find(&codes).Error; err != nil {
		return nil, err
	}
	result := make([]CodeDTO, 0, len(codes))
	for _, code := range codes {
		dto, err := toDTO(tx, code)
		if err != nil {
			return nil, err
		}
		result = append(result, dto)
	}
	return result, nil
}

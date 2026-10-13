package activation

import (
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"math/big"
	"sort"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type APIError struct {
	Status  int
	Message string
}

func (e *APIError) Error() string           { return e.Message }
func fail(status int, message string) error { return &APIError{status, message} }

type Service struct{ repo *Repository }

func NewService(repo *Repository) *Service { return &Service{repo: repo} }

// Validate the current account, rather than trusting a possibly stale JWT role.
func actorRole(tx *gorm.DB, actor uuid.UUID, student bool) (bool, error) {
	var user struct {
		Role   string
		Status string
	}
	res := tx.Table("users").Where("id = ?", actor).Take(&user)
	if errors.Is(res.Error, gorm.ErrRecordNotFound) {
		return false, fail(403, "Tài khoản không còn khả dụng.")
	}
	if res.Error != nil {
		return false, res.Error
	}
	if user.Status != "ACTIVE" {
		return false, fail(403, "Tài khoản đã bị khóa hoặc ngừng hoạt động.")
	}
	if student {
		if user.Role != "STUDENT" {
			return false, fail(403, "Chỉ học sinh được kích hoạt mã.")
		}
	} else if user.Role != "TEACHER" && user.Role != "ADMIN" {
		return false, fail(403, "Bạn không có quyền quản lý mã kích hoạt.")
	}
	return user.Role == "ADMIN", nil
}

func generateCode() (string, error) {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
	var code strings.Builder
	for i := 0; i < 8; i++ {
		n, err := rand.Int(rand.Reader, big.NewInt(int64(len(alphabet))))
		if err != nil {
			return "", err
		}
		code.WriteByte(alphabet[n.Int64()])
	}
	return code.String(), nil
}

func validateCreate(req CreateRequest, now time.Time) ([]uuid.UUID, error) {
	if _, err := accessDeadline(req.AccessDurationValue, req.AccessDurationUnit, now); err != nil {
		return nil, err
	}
	if req.Quantity < 1 || req.Quantity > 100 || len(req.CourseIDs) < 1 || len(req.CourseIDs) > 100 {
		return nil, fail(400, "Chọn 1–100 khóa học và tạo 1–100 mã mỗi lần.")
	}
	if req.ExpiresAt != nil && !req.ExpiresAt.After(now) {
		return nil, fail(400, "Hạn kích hoạt phải ở tương lai.")
	}
	ids := make([]uuid.UUID, 0, len(req.CourseIDs))
	seen := map[uuid.UUID]bool{}
	for _, id := range req.CourseIDs {
		if id == uuid.Nil {
			return nil, fail(400, "ID khóa học không hợp lệ.")
		}
		if !seen[id] {
			ids = append(ids, id)
			seen[id] = true
		}
	}
	sort.Slice(ids, func(i, j int) bool { return ids[i].String() < ids[j].String() })
	return ids, nil
}

func (s *Service) List(ctx context.Context, actor uuid.UUID) ([]CodeDTO, error) {
	admin, err := actorRole(s.repo.db.WithContext(ctx), actor, false)
	if err != nil {
		return nil, err
	}
	return s.repo.List(ctx, actor, admin)
}

func (s *Service) Create(ctx context.Context, actor uuid.UUID, req CreateRequest) ([]CodeDTO, error) {
	ids, err := validateCreate(req, time.Now())
	if err != nil {
		return nil, err
	}
	result := make([]CodeDTO, 0, req.Quantity)
	err = s.repo.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if _, err := actorRole(tx, actor, false); err != nil {
			return err
		}
		var courses []CourseOption
		if err := tx.Table("courses").Clauses(clause.Locking{Strength: "SHARE"}).Select("id, title").
			Where("id IN ? AND deleted_at IS NULL", ids).Order("id").Find(&courses).Error; err != nil {
			return err
		}
		if len(courses) != len(ids) {
			return fail(400, "Có khóa học không tồn tại hoặc đã bị xóa.")
		}
		for i := 0; i < req.Quantity; i++ {
			var code Code
			inserted := false
			for attempt := 0; attempt < 10; attempt++ {
				value, err := generateCode()
				if err != nil {
					return err
				}
				code = Code{ID: uuid.New(), Code: value, CourseID: ids[0], MaxUses: 1,
					Status: "ACTIVE", CreatedBy: &actor, ExpiresAt: req.ExpiresAt, CreatedAt: time.Now()}
				code.AccessDurationValue, code.AccessDurationUnit = req.AccessDurationValue, req.AccessDurationUnit
				res := tx.Clauses(clause.OnConflict{Columns: []clause.Column{{Name: "code"}}, DoNothing: true}).Create(&code)
				if res.Error != nil {
					return res.Error
				}
				if res.RowsAffected == 1 {
					inserted = true
					break
				}
			}
			if !inserted {
				return errors.New("could not allocate a unique activation code")
			}
			for order, id := range ids {
				if err := tx.Exec("INSERT INTO activation_code_courses (code_id, course_id, sort_order) VALUES (?, ?, ?)", code.ID, id, order).Error; err != nil {
					return err
				}
			}
			dto, err := toDTO(tx, code)
			if err != nil {
				return err
			}
			result = append(result, dto)
		}
		return nil
	})
	return result, err
}

func lockCode(tx *gorm.DB, id uuid.UUID) (Code, error) {
	var code Code
	err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Where("id = ? AND deleted_at IS NULL", id).Take(&code).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return code, fail(404, "Không tìm thấy mã kích hoạt.")
	}
	return code, err
}
func isUsed(code Code) bool { return code.UsedCount > 0 || code.UsedAt != nil }

func (s *Service) Change(ctx context.Context, actor, id uuid.UUID, remove bool) (CodeDTO, error) {
	var result CodeDTO
	err := s.repo.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		admin, err := actorRole(tx, actor, false)
		if err != nil {
			return err
		}
		code, err := lockCode(tx, id)
		if err != nil {
			return err
		}
		if !admin && (code.CreatedBy == nil || *code.CreatedBy != actor) {
			return fail(403, "Bạn chỉ được quản lý mã do mình tạo.")
		}
		if isUsed(code) {
			return fail(409, "Không thể xóa hoặc thay đổi mã đã sử dụng.")
		}
		if remove {
			return tx.Model(&Code{}).Where("id = ?", id).Update("deleted_at", time.Now()).Error
		}
		if code.Status == "DISABLED" {
			if code.ExpiresAt != nil && !code.ExpiresAt.After(time.Now()) {
				return fail(409, "Không thể mở lại mã đã hết hạn.")
			}
			code.Status = "ACTIVE"
		} else {
			code.Status = "DISABLED"
		}
		if err := tx.Model(&Code{}).Where("id = ?", id).Update("status", code.Status).Error; err != nil {
			return err
		}
		result, err = toDTO(tx, code)
		return err
	})
	return result, err
}

func (s *Service) Activate(ctx context.Context, actor uuid.UUID, value string) (ActivateResponse, error) {
	value = strings.ToUpper(strings.TrimSpace(value))
	if value == "" || len(value) > 50 {
		return ActivateResponse{}, fail(400, "Mã kích hoạt không hợp lệ.")
	}
	var result ActivateResponse
	err := s.repo.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Also serialize different codes redeemed by the same student, avoiding duplicate enrollments.
		var lockedUser struct{ ID uuid.UUID }
		if err := tx.Raw("SELECT id FROM users WHERE id = ? FOR UPDATE", actor).Scan(&lockedUser).Error; err != nil {
			return err
		}
		if _, err := actorRole(tx, actor, true); err != nil {
			return err
		}
		var code Code
		err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Where("code = ? AND deleted_at IS NULL", value).Take(&code).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fail(404, "Mã kích hoạt không tồn tại.")
		}
		if err != nil {
			return err
		}
		if isUsed(code) {
			if code.UsedBy != nil && *code.UsedBy == actor {
				courses, err := coursesForCode(tx, code.ID)
				if err != nil {
					return err
				}
				names := make([]string, 0, len(courses))
				for _, course := range courses {
					names = append(names, fmt.Sprintf("%q", course.Title))
				}
				if len(names) > 0 {
					return fail(409, fmt.Sprintf("Bạn đã sử dụng mã này để đăng ký khóa học %s rồi. Mỗi mã chỉ được dùng một lần.", strings.Join(names, ", ")))
				}
				return fail(409, "Bạn đã sử dụng mã này rồi. Mỗi mã chỉ được dùng một lần.")
			}
			return fail(409, "Mã kích hoạt này đã được sử dụng và không thể dùng lại.")
		}
		if code.Status != "ACTIVE" {
			return fail(403, "Mã kích hoạt đã bị vô hiệu hóa.")
		}
		now := time.Now()
		deadline, err := accessDeadline(code.AccessDurationValue, code.AccessDurationUnit, now)
		if err != nil {
			return err
		}
		if code.ExpiresAt != nil && !code.ExpiresAt.After(now) {
			return fail(410, "Mã kích hoạt đã hết hạn.")
		}
		courses, err := coursesForCode(tx, code.ID)
		if err != nil {
			return err
		}
		if len(courses) == 0 {
			return fail(409, "Mã chưa được gắn khóa học.")
		}
		for _, course := range courses {
			var available struct{ ID uuid.UUID }
			res := tx.Table("courses").Clauses(clause.Locking{Strength: "SHARE"}).Select("id").Where("id = ? AND deleted_at IS NULL AND status = 'PUBLISHED'", course.ID).Take(&available)
			if errors.Is(res.Error, gorm.ErrRecordNotFound) {
				return fail(409, "Có khóa học chưa xuất bản hoặc không còn khả dụng.")
			}
			if res.Error != nil {
				return res.Error
			}
			var enrollment struct {
				ID        uuid.UUID
				Status    string
				StartDate *time.Time
				EndDate   *time.Time
			}
			res = tx.Table("enrollments").Clauses(clause.Locking{Strength: "UPDATE"}).
				Where("user_id = ? AND course_id = ? AND status IN ('ACTIVE', 'PENDING', 'SUSPENDED')", actor, course.ID).Take(&enrollment)
			if res.Error != nil && !errors.Is(res.Error, gorm.ErrRecordNotFound) {
				return res.Error
			}
			if enrollment.Status == "SUSPENDED" {
				return fail(409, "Quyền học đang bị tạm khóa; vui lòng liên hệ giáo viên.")
			}
			if enrollment.Status == "ACTIVE" && !improvesAccess(enrollment.EndDate, deadline) {
				return fail(409, fmt.Sprintf("Bạn đã đăng ký khóa học %q. Thời hạn học của mã này không dài hơn quyền học hiện có. Mã vẫn chưa được sử dụng.", course.Title))
			}
			if enrollment.ID == uuid.Nil {
				err = tx.Exec("INSERT INTO enrollments (id, user_id, course_id, status, start_date, end_date, created_at) VALUES (?, ?, ?, 'ACTIVE', ?, ?, ?)", uuid.New(), actor, course.ID, now, deadline, now).Error
			} else {
				updates := map[string]interface{}{"status": "ACTIVE", "end_date": deadline}
				if enrollment.Status == "PENDING" || (enrollment.EndDate != nil && !enrollment.EndDate.After(now)) {
					updates["start_date"] = now
				}
				err = tx.Table("enrollments").Where("id = ?", enrollment.ID).Updates(updates).Error
			}
			if err != nil {
				return err
			}
		}
		if err := tx.Exec("INSERT INTO activation_redemptions (id, code_id, user_id, redeemed_at) VALUES (?, ?, ?, ?)", uuid.New(), code.ID, actor, now).Error; err != nil {
			return err
		}
		if err := tx.Model(&Code{}).Where("id = ?", code.ID).Updates(map[string]interface{}{"used_count": 1, "used_by": actor, "used_at": now}).Error; err != nil {
			return err
		}
		result = ActivateResponse{Success: true, Message: "Kích hoạt khóa học thành công!", Courses: courses, Code: code.Code, ActivatedAt: now, AccessExpiresAt: deadline}
		return nil
	})
	return result, err
}

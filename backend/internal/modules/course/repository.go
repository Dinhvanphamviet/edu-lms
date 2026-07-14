package course

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Repository interface {
	GetCategories() ([]CourseCategory, error)
	GetCourses(categorySlug string) ([]Course, error)
	GetCourseBySlug(slug string) (*Course, error)
	GetCourseCurriculum(courseID uuid.UUID) ([]CurriculumChapterDTO, error)
	AutoMigrateAndSeed() error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) GetCategories() ([]CourseCategory, error) {
	var categories []CourseCategory
	err := r.db.Find(&categories).Error
	return categories, err
}

func (r *repository) GetCourses(categorySlug string) ([]Course, error) {
	var courses []Course

	query := r.db.Where("status = ?", "PUBLISHED")

	if categorySlug != "" && categorySlug != "all" {
		query = query.Joins("JOIN course_category_relations ON courses.id = course_category_relations.course_id").
			Joins("JOIN course_categories ON course_categories.id = course_category_relations.category_id").
			Where("course_categories.slug = ?", categorySlug)
	}

	if err := query.Find(&courses).Error; err != nil {
		return nil, err
	}

	// Batch compute stats in a single query (avoid N+1)
	if len(courses) > 0 {
		courseIDs := make([]uuid.UUID, len(courses))
		for i, c := range courses {
			courseIDs[i] = c.ID
		}

		type courseStatsRow struct {
			CourseID  uuid.UUID `gorm:"column:course_id"`
			Lessons   int       `gorm:"column:lessons"`
			Exams     int       `gorm:"column:exams"`
			Documents int       `gorm:"column:documents"`
		}
		var statsRows []courseStatsRow
		r.db.Raw(`
			SELECT 
				c_id AS course_id,
				COALESCE(lesson_counts.cnt, 0) AS lessons,
				COALESCE(exam_counts.cnt, 0) AS exams,
				COALESCE(doc_counts.cnt, 0) AS documents
			FROM UNNEST(?::uuid[]) AS c_id
			LEFT JOIN LATERAL (
				SELECT COUNT(*) AS cnt FROM lessons l JOIN chapters ch ON l.chapter_id = ch.id WHERE ch.course_id = c_id
			) lesson_counts ON true
			LEFT JOIN LATERAL (
				SELECT COUNT(*) AS cnt FROM assessments a JOIN lessons l ON a.lesson_id = l.id JOIN chapters ch ON l.chapter_id = ch.id WHERE ch.course_id = c_id
			) exam_counts ON true
			LEFT JOIN LATERAL (
				SELECT COUNT(*) AS cnt FROM lesson_resources lr JOIN lessons l ON lr.lesson_id = l.id JOIN chapters ch ON l.chapter_id = ch.id WHERE ch.course_id = c_id
			) doc_counts ON true
		`, pq.Array(courseIDs)).Scan(&statsRows)

		statsMap := make(map[uuid.UUID]CourseStats)
		for _, row := range statsRows {
			statsMap[row.CourseID] = CourseStats{
				Lessons:   row.Lessons,
				Exams:     row.Exams,
				Documents: row.Documents,
			}
		}
		for i := range courses {
			if s, ok := statsMap[courses[i].ID]; ok {
				courses[i].Stats = s
			}
		}
	}

	return courses, nil
}

func (r *repository) GetCourseBySlug(slug string) (*Course, error) {
	var course Course
	if err := r.db.Where("slug = ?", slug).First(&course).Error; err != nil {
		return nil, err
	}

	// Compute stats dynamically
	r.db.Raw("SELECT COUNT(*) FROM lessons l JOIN chapters c ON l.chapter_id = c.id WHERE c.course_id = ?", course.ID).Scan(&course.Stats.Lessons)
	r.db.Raw("SELECT COUNT(*) FROM assessments a JOIN lessons l ON a.lesson_id = l.id JOIN chapters c ON l.chapter_id = c.id WHERE c.course_id = ?", course.ID).Scan(&course.Stats.Exams)
	r.db.Raw("SELECT COUNT(*) FROM lesson_resources lr JOIN lessons l ON lr.lesson_id = l.id JOIN chapters c ON l.chapter_id = c.id WHERE c.course_id = ?", course.ID).Scan(&course.Stats.Documents)

	return &course, nil
}

func (r *repository) AutoMigrateAndSeed() error {
	if err := r.db.AutoMigrate(&CourseCategory{}, &CourseCategoryRelation{}, &Chapter{}, &Lesson{}); err != nil {
		return err
	}
	return nil
}

func (r *repository) GetCourseCurriculum(courseID uuid.UUID) ([]CurriculumChapterDTO, error) {
	var chapters []Chapter
	if err := r.db.Where("course_id = ?", courseID).Order("sort_order asc").Find(&chapters).Error; err != nil {
		return nil, err
	}

	if len(chapters) == 0 {
		return make([]CurriculumChapterDTO, 0), nil
	}

	chapterIDs := make([]uuid.UUID, len(chapters))
	for i, ch := range chapters {
		chapterIDs[i] = ch.ID
	}

	var rows []struct {
		ChapterID uuid.UUID
		LessonID  uuid.UUID
		Title     string
		Type      string
		ExamCount int
		DocCount  int
	}

	r.db.Raw(`
		SELECT 
			l.chapter_id,
			l.id as lesson_id, 
			l.title, 
			l.type, 
			COALESCE(a.exam_count, 0) as exam_count, 
			COALESCE(r.doc_count, 0) as doc_count
		FROM lessons l
		LEFT JOIN (SELECT lesson_id, COUNT(*) as exam_count FROM assessments GROUP BY lesson_id) a ON a.lesson_id = l.id
		LEFT JOIN (SELECT lesson_id, COUNT(*) as doc_count FROM lesson_resources GROUP BY lesson_id) r ON r.lesson_id = l.id
		WHERE l.chapter_id IN ?
		ORDER BY l.sort_order ASC
	`, chapterIDs).Scan(&rows)

	lessonMap := make(map[uuid.UUID][]CurriculumThemeDTO)
	type chapStats struct{ lessons, exams int }
	chapterStatsMap := make(map[uuid.UUID]*chapStats)

	for _, ch := range chapters {
		chapterStatsMap[ch.ID] = &chapStats{}
	}

	for _, row := range rows {
		lessonCount := 1
		examCount := row.ExamCount
		
		// If the lesson itself is a quiz, we shouldn't count it as a video lecture
		if row.Type == string(LessonTypeQuiz) {
			lessonCount = 0
			examCount += 1 // Count the lesson itself as an exam
		}

		themes := lessonMap[row.ChapterID]
		themes = append(themes, CurriculumThemeDTO{
			ID:    row.LessonID.String(),
			Title: row.Title,
			Stats: fmt.Sprintf("%d Bài giảng / %d Bài tập / %d Tài liệu", lessonCount, examCount, row.DocCount),
		})
		lessonMap[row.ChapterID] = themes

		stats := chapterStatsMap[row.ChapterID]
		stats.lessons += lessonCount
		stats.exams += examCount
	}

	dtos := make([]CurriculumChapterDTO, 0, len(chapters))
	for _, ch := range chapters {
		themes := lessonMap[ch.ID]
		if themes == nil {
			themes = make([]CurriculumThemeDTO, 0)
		}
		stats := chapterStatsMap[ch.ID]
		dtos = append(dtos, CurriculumChapterDTO{
			ID:     ch.ID.String(),
			Title:  ch.Title,
			Stats:  fmt.Sprintf("%d Bài giảng / %d Bài thi online", stats.lessons, stats.exams),
			Themes: themes,
		})
	}

	return dtos, nil
}



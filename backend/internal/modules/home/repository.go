package home

import (
	"fmt"
	"gorm.io/gorm"
)

type Repository interface {
	GetBanners() ([]Banner, error)
	GetCountdown() (*CountdownConfig, error)
	GetCollections() ([]CourseCollection, error)
	AutoMigrateAndSeed() error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) GetBanners() ([]Banner, error) {
	var banners []Banner
	err := r.db.Where("is_active = ?", true).Order("sort_order ASC").Find(&banners).Error
	return banners, err
}

func (r *repository) GetCountdown() (*CountdownConfig, error) {
	var countdown CountdownConfig
	err := r.db.Where("is_active = ?", true).Order("id DESC").First(&countdown).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil // return null if no countdown
		}
		return nil, err
	}
	return &countdown, nil
}

func (r *repository) GetCollections() ([]CourseCollection, error) {
	var collections []CourseCollection
	err := r.db.Where("is_active = ?", true).Order("created_at ASC").Find(&collections).Error
	if err == nil {
		for i := range collections {
			courses := make([]Course, 0)
			err := r.db.Raw("SELECT c.* FROM courses c JOIN collection_courses cc ON c.id = cc.course_id WHERE cc.collection_id = ? AND c.deleted_at IS NULL", collections[i].ID).Scan(&courses).Error
			if err != nil {
				fmt.Println("Error fetching courses for collection:", err)
			}
			for j := range courses {
				r.db.Raw("SELECT COUNT(*) FROM lessons l JOIN chapters c ON l.chapter_id = c.id WHERE c.course_id = ?", courses[j].ID).Scan(&courses[j].Stats.Lessons)
				r.db.Raw("SELECT COUNT(*) FROM assessments a JOIN lessons l ON a.lesson_id = l.id JOIN chapters c ON l.chapter_id = c.id WHERE c.course_id = ?", courses[j].ID).Scan(&courses[j].Stats.Exams)
				r.db.Raw("SELECT COUNT(*) FROM lesson_resources lr JOIN lessons l ON lr.lesson_id = l.id JOIN chapters c ON l.chapter_id = c.id WHERE c.course_id = ?", courses[j].ID).Scan(&courses[j].Stats.Documents)
			}

			collections[i].Courses = courses
		}
	}
	return collections, err
}

func (r *repository) AutoMigrateAndSeed() error {
	return r.db.AutoMigrate(&Banner{}, &CountdownConfig{}, &Course{}, &CourseCollection{})
}

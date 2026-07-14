package course

type Service interface {
	GetCategories() ([]CourseCategory, error)
	GetCourses(categorySlug string) ([]Course, error)
	GetCourseBySlug(slug string) (*Course, error)
	GetCourseCurriculum(slug string) ([]CurriculumChapterDTO, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetCategories() ([]CourseCategory, error) {
	return s.repo.GetCategories()
}

func (s *service) GetCourses(categorySlug string) ([]Course, error) {
	return s.repo.GetCourses(categorySlug)
}

func (s *service) GetCourseBySlug(slug string) (*Course, error) {
	return s.repo.GetCourseBySlug(slug)
}

func (s *service) GetCourseCurriculum(slug string) ([]CurriculumChapterDTO, error) {
	course, err := s.repo.GetCourseBySlug(slug)
	if err != nil {
		return nil, err
	}
	return s.repo.GetCourseCurriculum(course.ID)
}

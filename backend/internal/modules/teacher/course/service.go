package tcourse

type Service interface {
	GetTeacherCourses(teacherID string) ([]TeacherCourseDTO, error)
	GetCourseByID(courseID string) (*TeacherCourseDetailDTO, error)
	CreateCourse(req CreateCourseRequest, teacherID string) (*TeacherCourseDTO, error)
	UpdateCourse(courseID string, req UpdateCourseRequest) (*TeacherCourseDetailDTO, error)
	UpdateCourseStatus(courseID string, status string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetTeacherCourses(teacherID string) ([]TeacherCourseDTO, error) {
	return s.repo.GetTeacherCourses(teacherID)
}

func (s *service) GetCourseByID(courseID string) (*TeacherCourseDetailDTO, error) {
	return s.repo.GetCourseByID(courseID)
}

func (s *service) CreateCourse(req CreateCourseRequest, teacherID string) (*TeacherCourseDTO, error) {
	return s.repo.CreateCourse(req, teacherID)
}

func (s *service) UpdateCourse(courseID string, req UpdateCourseRequest) (*TeacherCourseDetailDTO, error) {
	return s.repo.UpdateCourse(courseID, req)
}

func (s *service) UpdateCourseStatus(courseID string, status string) error {
	return s.repo.UpdateCourseStatus(courseID, status)
}

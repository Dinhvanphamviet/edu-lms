package tcategory

type Service interface {
	GetCategories() ([]TeacherCategoryDTO, error)
	CreateCategory(req CreateCategoryRequest) (*TeacherCategoryDTO, error)
	UpdateCategory(categoryID string, req UpdateCategoryRequest) (*TeacherCategoryDTO, error)
	DeleteCategory(categoryID string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetCategories() ([]TeacherCategoryDTO, error) {
	return s.repo.GetCategories()
}

func (s *service) CreateCategory(req CreateCategoryRequest) (*TeacherCategoryDTO, error) {
	return s.repo.CreateCategory(req)
}

func (s *service) UpdateCategory(categoryID string, req UpdateCategoryRequest) (*TeacherCategoryDTO, error) {
	return s.repo.UpdateCategory(categoryID, req)
}

func (s *service) DeleteCategory(categoryID string) error {
	return s.repo.DeleteCategory(categoryID)
}

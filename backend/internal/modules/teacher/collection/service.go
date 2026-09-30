package tcollection

type Service interface {
	GetCollections() ([]TeacherCollectionDTO, error)
	GetCollectionByID(id string) (*TeacherCollectionDTO, error)
	CreateCollection(req CreateCollectionRequest) (*TeacherCollectionDTO, error)
	UpdateCollection(id string, req UpdateCollectionRequest) (*TeacherCollectionDTO, error)
	UpdateCollectionStatus(id string, isActive bool) error
	DeleteCollection(id string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetCollections() ([]TeacherCollectionDTO, error) {
	return s.repo.GetCollections()
}

func (s *service) GetCollectionByID(id string) (*TeacherCollectionDTO, error) {
	return s.repo.GetCollectionByID(id)
}

func (s *service) CreateCollection(req CreateCollectionRequest) (*TeacherCollectionDTO, error) {
	return s.repo.CreateCollection(req)
}

func (s *service) UpdateCollection(id string, req UpdateCollectionRequest) (*TeacherCollectionDTO, error) {
	return s.repo.UpdateCollection(id, req)
}

func (s *service) UpdateCollectionStatus(id string, isActive bool) error {
	return s.repo.UpdateCollectionStatus(id, isActive)
}

func (s *service) DeleteCollection(id string) error {
	return s.repo.DeleteCollection(id)
}

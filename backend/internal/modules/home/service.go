package home

type Service interface {
	GetHomeData() (*HomeResponse, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetHomeData() (*HomeResponse, error) {
	// Execute all queries
	banners, err := s.repo.GetBanners()
	if err != nil {
		return nil, err
	}

	countdown, err := s.repo.GetCountdown()
	if err != nil {
		return nil, err
	}

	collections, err := s.repo.GetCollections()
	if err != nil {
		return nil, err
	}

	return &HomeResponse{
		Banners:     banners,
		Countdown:   countdown,
		Collections: collections,
	}, nil
}

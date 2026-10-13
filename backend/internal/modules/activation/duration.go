package activation

import "time"

// Calendar months/years clamp to the last day of the target month, in Vietnam time.
func accessDeadline(value *int, unit *string, activatedAt time.Time) (*time.Time, error) {
	if value == nil && unit == nil {
		return nil, nil
	}
	if value == nil || unit == nil || *value <= 0 {
		return nil, fail(400, "Thời hạn học phải có số lượng dương và đơn vị ngày/tháng/năm.")
	}
	local := activatedAt.In(time.FixedZone("Asia/Ho_Chi_Minh", 7*60*60))
	var deadline time.Time
	switch *unit {
	case "DAY":
		if *value > 36500 {
			return nil, fail(400, "Thời hạn học tối đa 36500 ngày.")
		}
		deadline = local.AddDate(0, 0, *value)
	case "MONTH", "YEAR":
		months := *value
		if *unit == "YEAR" {
			if *value > 100 {
				return nil, fail(400, "Thời hạn học tối đa 100 năm.")
			}
			months *= 12
		} else if *value > 1200 {
			return nil, fail(400, "Thời hạn học tối đa 1200 tháng.")
		}
		first := time.Date(local.Year(), local.Month(), 1, local.Hour(), local.Minute(), local.Second(), local.Nanosecond(), local.Location()).AddDate(0, months, 0)
		lastDay := first.AddDate(0, 1, -1).Day()
		day := local.Day()
		if day > lastDay {
			day = lastDay
		}
		deadline = time.Date(first.Year(), first.Month(), day, local.Hour(), local.Minute(), local.Second(), local.Nanosecond(), local.Location())
	default:
		return nil, fail(400, "Đơn vị thời hạn học phải là DAY, MONTH hoặc YEAR.")
	}
	return &deadline, nil
}

func improvesAccess(existing, proposed *time.Time) bool {
	return existing != nil && (proposed == nil || proposed.After(*existing))
}

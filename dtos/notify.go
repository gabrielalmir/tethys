package dtos

type Notify struct {
	Email    string  `json:"email"`
	Rainfall float64 `json:"rainfall"`
	Lake     float64 `json:"lake"`
	Status   string  `json:"status"`
}

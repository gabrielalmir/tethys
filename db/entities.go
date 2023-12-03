package db

import "time"

type User struct {
	Name       string `gorm:"type:varchar(100);"`
	Email      string `gorm:"type:varchar(100);uniqueIndex"`
	Phone      string `gorm:"type:varchar(100);"`
	PostalCode string `gorm:"type:varchar(100);column:postalcode"`
}

func (u *User) TableName() string {
	return "users"
}

type Notification struct {
	Email        string    `bson:"email"`
	PostalCode   string    `bson:"postalcode"`
	City         string    `bson:"city"`
	Neighborhood string    `bson:"neighborhood"`
	State        string    `bson:"state"`
	Rainfall     float64   `bson:"rainfall"`
	Lake         float64   `bson:"lake_volume"`
	Tag          string    `bson:"tag"`
	Latitude     string    `bson:"latitude"`
	Longitude    string    `bson:"longitude"`
	Timestamp    time.Time `bson:"timestamp"`
}

func NewNotification(
	email string,
	postalcode string,
	city string,
	neighborhood string,
	state string,
	rainfall float64,
	lake float64,
	tag string,
	latitude string,
	longitude string,
) *Notification {
	return &Notification{
		Email:        email,
		PostalCode:   postalcode,
		City:         city,
		Neighborhood: neighborhood,
		State:        state,
		Rainfall:     rainfall,
		Lake:         lake,
		Tag:          tag,
		Latitude:     latitude,
		Longitude:    longitude,
		Timestamp:    time.Now(),
	}
}

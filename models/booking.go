package models

import "gorm.io/gorm"

type Booking struct {
	gorm.Model
	UserID    uint
	VehicleID uint
	StartDate string
	EndDate   string
	Status    string // booked, cancelled
}
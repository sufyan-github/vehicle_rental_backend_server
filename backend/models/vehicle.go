package models

import "gorm.io/gorm"

type Vehicle struct {
	gorm.Model
	Name        string
	Brand       string
	PricePerDay float64
	Available   bool
}
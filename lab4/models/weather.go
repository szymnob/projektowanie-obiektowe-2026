package models

import "gorm.io/gorm"

type WeatherResponse struct {
	Current struct {
		Temperature float64 `json:"temperature_2m"`
		WindSpeed   float64 `json:"wind_speed_10m"`
	} `json:"current"`
}

type WeatherRecord struct {
	gorm.Model
	City        string  `json:"city"`
	Temperature float64 `json:"temperature"`
}
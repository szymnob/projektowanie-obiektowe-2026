package database

import (
	"lab4/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	var err error
	DB, err = gorm.Open(sqlite.Open("weather.db"), &gorm.Config{})
	if err != nil {
		panic("Nie udało się połączyć z bazą danych")
	}

	DB.AutoMigrate(&models.WeatherRecord{})

	seedData()
}

func seedData() {
	var count int64
	DB.Model(&models.WeatherRecord{}).Count(&count)
	
	if count == 0 {
		initialWeather := []models.WeatherRecord{
			{City: "Krakow", Temperature: 15.5},
			{City: "Warszawa", Temperature: 18.2},
		}
		DB.Create(&initialWeather)
	}
}
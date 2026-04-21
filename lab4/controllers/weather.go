package controllers

import (
	"net/http"
	"lab4/database"
	"lab4/models"
	"lab4/services"
	"github.com/labstack/echo/v4"
)

func GetWeather(c echo.Context) error {
	apiData, err := services.FetchWeatherData()
	if err != nil {
		return c.JSON(http.StatusBadGateway, map[string]string{"error": "Błąd API"})
	}

	var lastRecords []models.WeatherRecord
	database.DB.Limit(5).Find(&lastRecords)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"current_api": apiData.Current,
		"db_records":  lastRecords,
	})
}
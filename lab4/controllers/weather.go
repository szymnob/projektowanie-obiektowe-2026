package controllers

import (
	"net/http"
	"lab4/services"
	"github.com/labstack/echo/v4"
)

func GetWeather(c echo.Context) error {
	data, err := services.FetchWeatherData()
	if err != nil {
		return c.JSON(http.StatusBadGateway, map[string]string{"error": "Błąd API zewnętrznego"})
	}

	return c.JSON(http.StatusOK, data)
}
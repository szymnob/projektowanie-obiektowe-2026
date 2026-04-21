package services

import (
	"encoding/json"
	"net/http"
	"lab4/models"
)

func FetchWeatherData() (*models.WeatherResponse, error) {
	apiURL := "https://api.open-meteo.com/v1/forecast?latitude=50.06&longitude=19.94&current=temperature_2m,wind_speed_10m"

	resp, err := http.Get(apiURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var data models.WeatherResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, err
	}

	return &data, nil
}
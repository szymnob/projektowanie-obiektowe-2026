package main

import (
	"lab4/controllers"
	"lab4/database"
	"github.com/labstack/echo/v4"
)

func main() {
	database.InitDB()

	e := echo.New()

	e.Match([]string{"GET", "POST"}, "/pogoda", controllers.GetWeather)

	e.Logger.Fatal(e.Start(":1323"))
}
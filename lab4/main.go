package main

import (
	"lab4/controllers"
	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()

	e.Match([]string{"GET", "POST"}, "/pogoda", controllers.GetWeather)

	e.Logger.Fatal(e.Start(":1323"))
}
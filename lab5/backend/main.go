package main

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Product struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Category    string  `json:"category"`
}

type CartItem struct {
	ProductID int `json:"productId"`
	Quantity  int `json:"quantity"`
}

type CartPayload struct {
	Items []CartItem `json:"items"`
}

type PaymentPayload struct {
	Name          string `json:"name"`
	Email         string `json:"email"`
	Address       string `json:"address"`
	Method        string `json:"method"`
	CardLast4     string `json:"cardLast4"`
	CartItems     int    `json:"cartItems"`
	TotalCents    int64  `json:"totalCents"`
	ClientOrderID string `json:"clientOrderId"`
}

var products = []Product{
	{ID: 1, Name: "Klawiatura mechaniczna", Description: "Hot-swap, RGB, layout 75%", Price: 329.00, Category: "Akcesoria"},
	{ID: 2, Name: "Mysz ergonomiczna", Description: "Sensor 26K DPI, 8 przyciskow", Price: 219.00, Category: "Akcesoria"},
	{ID: 3, Name: "Monitor 27''", Description: "QHD, 165Hz, IPS", Price: 1349.00, Category: "Monitory"},
	{ID: 4, Name: "Sluchawki bezprzewodowe", Description: "ANC + mikrofon", Price: 499.00, Category: "Audio"},
}

func main() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173", "http://127.0.0.1:5173"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodOptions},
		AllowHeaders: []string{echo.HeaderContentType, echo.HeaderAuthorization},
	}))

	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]any{"status": "ok", "time": time.Now().UTC()})
	})

	e.GET("/api/products", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]any{"products": products})
	})

	e.POST("/api/cart", func(c echo.Context) error {
		payload := CartPayload{}
		if err := c.Bind(&payload); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid cart payload"})
		}

		if len(payload.Items) == 0 {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "cart cannot be empty"})
		}

		return c.JSON(http.StatusOK, map[string]any{
			"message":       "cart received",
			"itemsReceived": len(payload.Items),
		})
	})

	e.POST("/api/payments", func(c echo.Context) error {
		payload := PaymentPayload{}
		if err := c.Bind(&payload); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid payment payload"})
		}

		if payload.Name == "" || payload.Email == "" || payload.Method == "" || payload.TotalCents <= 0 {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "missing required payment fields"})
		}

		return c.JSON(http.StatusCreated, map[string]any{
			"message":       "payment accepted",
			"serverOrderID": "ORD-" + time.Now().UTC().Format("20060102150405"),
			"amountCents":   payload.TotalCents,
		})
	})

	e.Logger.Fatal(e.Start(":8080"))
}

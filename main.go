package main

import (
	"vehicle-rental/config"
	"vehicle-rental/models"
	"vehicle-rental/routes" // ✅ ADD THIS

	"github.com/gin-gonic/gin"

	swaggerFiles "github.com/swaggo/files"

	ginSwagger "github.com/swaggo/gin-swagger"
)

import "os"

func main() {
	r := gin.Default()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Connect DB
	config.ConnectDB()

	// Auto migrate tables
	config.DB.AutoMigrate(&models.User{}, &models.Vehicle{}, &models.Booking{})

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Vehicle Rental API running",
		})
	})

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	routes.SetupRoutes(r) // ✅ now works

	r.Run(":" + port)
}

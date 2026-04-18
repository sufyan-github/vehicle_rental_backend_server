package routes

import (
	"vehicle-rental/controllers"
	"vehicle-rental/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {

	// Public
	r.POST("/register", controllers.Register)
	r.POST("/login", controllers.Login)
	r.GET("/vehicles", controllers.GetVehicles)

	// Protected
	auth := r.Group("/")
	auth.Use(middleware.AuthMiddleware())

	auth.GET("/profile", func(c *gin.Context) {
		userID, _ := c.Get("user_id")
		c.JSON(200, gin.H{"user_id": userID})
	})

	// Admin routes
	admin := r.Group("/admin")
	admin.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())

	admin.POST("/vehicle", controllers.CreateVehicle)
	admin.PUT("/vehicle/:id", controllers.UpdateVehicle)
	admin.DELETE("/vehicle/:id", controllers.DeleteVehicle)

	auth.POST("/book", controllers.CreateBooking)

	auth.GET("/my-bookings", controllers.GetMyBookings)

	auth.PUT("/cancel-booking/:id", controllers.CancelBooking)
}

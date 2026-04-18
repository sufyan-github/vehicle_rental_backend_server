package controllers

import (
	"net/http"
	"vehicle-rental/config"
	"vehicle-rental/models"

	"github.com/gin-gonic/gin"
)

// Create Booking
func CreateBooking(c *gin.Context) {
	var booking models.Booking

	if err := c.BindJSON(&booking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get logged-in user
	userID, _ := c.Get("user_id")
	booking.UserID = uint(userID.(float64))

	// Check vehicle availability
	var vehicle models.Vehicle
	config.DB.First(&vehicle, booking.VehicleID)

	if !vehicle.Available {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vehicle not available"})
		return
	}

	// Mark vehicle unavailable
	vehicle.Available = false
	config.DB.Save(&vehicle)

	booking.Status = "booked"

	config.DB.Create(&booking)

	c.JSON(http.StatusOK, booking)
}

// Get My Bookings
func GetMyBookings(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var bookings []models.Booking
	config.DB.Where("user_id = ?", userID).Find(&bookings)

	c.JSON(http.StatusOK, bookings)
}


// Cancel Booking
func CancelBooking(c *gin.Context) {
	id := c.Param("id")

	var booking models.Booking
	config.DB.First(&booking, id)

	if booking.ID == 0 {
		c.JSON(404, gin.H{"error": "Booking not found"})
		return
	}

	// Update booking status
	booking.Status = "cancelled"
	config.DB.Save(&booking)

	// Make vehicle available again
	var vehicle models.Vehicle
	config.DB.First(&vehicle, booking.VehicleID)

	vehicle.Available = true
	config.DB.Save(&vehicle)

	c.JSON(200, gin.H{
		"message": "Booking cancelled",
	})
}
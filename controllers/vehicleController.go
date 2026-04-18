package controllers

import (
	"net/http"
	"vehicle-rental/config"
	"vehicle-rental/models"

	"github.com/gin-gonic/gin"
)

// Create Vehicle (Admin)
func CreateVehicle(c *gin.Context) {
	var vehicle models.Vehicle

	if err := c.BindJSON(&vehicle); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Create(&vehicle)

	c.JSON(http.StatusOK, vehicle)
}

// Get All Vehicles
func GetVehicles(c *gin.Context) {
	var vehicles []models.Vehicle
	config.DB.Find(&vehicles)

	c.JSON(http.StatusOK, vehicles)
}

// Update Vehicle
func UpdateVehicle(c *gin.Context) {
	id := c.Param("id")
	var vehicle models.Vehicle

	config.DB.First(&vehicle, id)
	c.BindJSON(&vehicle)

	config.DB.Save(&vehicle)

	c.JSON(http.StatusOK, vehicle)
}

// Delete Vehicle
func DeleteVehicle(c *gin.Context) {
	id := c.Param("id")

	config.DB.Delete(&models.Vehicle{}, id)

	c.JSON(http.StatusOK, gin.H{
		"message": "Vehicle deleted",
	})
}
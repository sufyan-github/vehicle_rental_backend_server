package controllers

import (
	"net/http"
	"vehicle-rental/config"
	"vehicle-rental/models"
	"vehicle-rental/utils"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// Register
func Register(c *gin.Context) {
	var user models.User

	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Hash password
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
	user.Password = string(hashedPassword)

	config.DB.Create(&user)

	c.JSON(http.StatusOK, gin.H{
		"message": "User registered successfully",
	})
}

// Login
func Login(c *gin.Context) {
	var input models.User
	var user models.User

	c.BindJSON(&input)

	// Find user
	config.DB.Where("email = ?", input.Email).First(&user)

	// Compare password
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Generate token
	token, _ := utils.GenerateToken(user.ID)

	c.JSON(http.StatusOK, gin.H{
		"token": token,
	})
}
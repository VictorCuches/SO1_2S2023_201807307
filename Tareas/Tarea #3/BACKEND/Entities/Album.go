package Entities	

import "gorm.io/gorm"


type Album struct {
	gorm.Model	

	Title string
	Artist string 
	Genre string 
	Year string
	
}
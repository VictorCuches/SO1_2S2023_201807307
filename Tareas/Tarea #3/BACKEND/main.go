package main

import (
	"BACKEND/Config"
	"BACKEND/Entities"
	"github.com/gofiber/fiber/v2"
	"fmt"
	"log"
)

func main() {
	app := fiber.New()
	err := Config.Connect()

	if err != nil {
		log.Fatalln("Error ", err)
	}

	insertData()


	err = app.Listen(":8000")
	if err != nil {
		log.Fatal("Error ", err)
	}
}

func insertData(){
	album := Entities.Album{
		Title: "Uno", 
		Artist:"Dos", 
		Genre:"Tres", 
		Year: "2022"}

	Config.Database.Create(&album)
	fmt.Println(album)
}

package Config

import (
	"BACKEND/Entities"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var Database *gorm.DB
var Uri = "root:28800@tcp(localhost:33061)/SOPES?charset=utf8&parseTime=True&loc=Local"

func Connect() error {
	var err error

	Database, err = gorm.Open(mysql.Open(Uri), &gorm.Config{
		SkipDefaultTransaction: true,
		PrepareStmt:            true,
	})
	if err != nil {
		panic(err)
	}

	err = Database.AutoMigrate(&Entities.Album{})
	if err != nil {
		return err
	}


	return nil
}
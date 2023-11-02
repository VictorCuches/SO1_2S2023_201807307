package main

import (
	"context"
	"fmt"
	pb "golangClient/grpcClient"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var ctx = context.Background()

type Data struct {
	Carnet   uint64
	Nombre   string
	Curso    string
	Nota     uint32
	Semestre string
	Year     uint32
}

func insertData(c *fiber.Ctx) error {
	var data map[string]interface{}
	e := c.BodyParser(&data)
	if e != nil {
		return e
	}

	// Parsear el carnet como un valor numérico
	carnet, ok := data["carnet"].(float64)
	if !ok {
		return fmt.Errorf("El campo 'carnet' debe ser un número")
	}

	// Parsear la nota como un valor numérico
	nota, ok := data["nota"].(float64)
	if !ok {
		return fmt.Errorf("El campo 'nota' debe ser un número")
	}

	// Parsear el year como un valor numérico
	year, ok := data["year"].(float64)
	if !ok {
		return fmt.Errorf("El campo 'year' debe ser un número")
	}

	rank := Data{
		Carnet:   uint64(carnet),
		Nombre:   data["nombre"].(string),
		Curso:    data["curso"].(string),
		Nota:     uint32(nota),
		Semestre: data["semestre"].(string),
		Year:     uint32(year),
	}

	sendRedisServer(rank)
	// go sendMysqlServer(rank)

	return nil
}

func sendRedisServer(rank Data) {
	conn, err := grpc.Dial("grpc-server:7001", grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithBlock())
	if err != nil {
		log.Fatalln(err)
	}

	cl := pb.NewGetInfoClient(conn)
	defer func(conn *grpc.ClientConn) {
		err := conn.Close()
		if err != nil {
			log.Fatalln(err)
		}
	}(conn)

	ret, err := cl.ReturnInfo(ctx, &pb.RequestId{
		Carnet:   uint64(rank.Carnet),
		Nombre:   rank.Nombre,
		Curso:    rank.Curso,
		Nota:     uint32(rank.Nota),
		Semestre: rank.Semestre,
		Year:     uint32(rank.Year),
	})
	if err != nil {
		log.Fatalln(err)
	}

	fmt.Println("grpc-server: " + ret.GetInfo())
}

func sendMysqlServer(rank Data) {

}

func main() {
	app := fiber.New()

	// Configura el middleware CORS para aceptar cualquier origen
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET, POST, PUT, DELETE",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"res": "Hola desde grpc-client",
		})
	})
	app.Post("/insert", insertData)

	err := app.Listen(":7000")
	if err != nil {
		return
	}
}

package main

import (
	"context"
	"database/sql"
	"fmt"
	pb "golangServer/grpcServer"
	"log"
	"net"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"google.golang.org/grpc"
)

var ctx = context.Background()
var db *sql.DB

type server struct {
	pb.UnimplementedGetInfoServer
}

const (
	port = ":3001"
)

type Data struct {
	Carnet   uint64
	Nombre   string
	Curso    string
	Nota     uint32
	Semestre string
	Year     uint32
}

var _ = godotenv.Load(".env") // Cargar del archivo llamado ".env"
var (
	ConnectionString = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s",
		os.Getenv("MYSQLDB_USER"),
		os.Getenv("MYSQLDB_PASS"),
		os.Getenv("MYSQLDB_HOST"),
		os.Getenv("MYSQLDB_PORT"),
		os.Getenv("MYSQLDB_DB"))
)

func main() {
	// Establecer conexión a la base de datos MySQL
	// db, err := sql.Open("mysql", "root:root@tcp(34.170.239.207:3306)/sopes")
	// if err != nil {
	// 	log.Fatal("Error al conectar a la base de datos:", err)
	// } else {
	// 	fmt.Println("Conexión a la base de datos establecida correctamente.")
	// }
	// defer db.Close()

	// TODO: Revisar CORS si no me deja conectarme a esta api

	listen, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalln(err)
	}
	s := grpc.NewServer()
	pb.RegisterGetInfoServer(s, &server{})

	if err := s.Serve(listen); err != nil {
		log.Fatalln(err)
	}
}

func getDB() (*sql.DB, error) {
	return sql.Open("mysql", ConnectionString)
}

func (s *server) ReturnInfo(ctx context.Context, in *pb.RequestId) (*pb.ReplyInfo, error) {
	fmt.Println("Recibí de cliente: ", in.GetCarnet())
	data := Data{
		Carnet:   in.GetCarnet(),
		Nombre:   in.GetNombre(),
		Curso:    in.GetCurso(),
		Nota:     in.GetNota(),
		Semestre: in.GetSemestre(),
		Year:     in.GetYear(),
	}
	fmt.Println(data)

	insertDataMySQL(data)

	return &pb.ReplyInfo{Info: "Hola cliente, recibí el comentario"}, nil
}

func insertDataMySQL(data Data) error {
	bd, err := getDB()
	if err != nil {
		fmt.Println("ERROR AL CONECTAR A LA BASE DE DATOS ", err)
		return err
	}
	_, err = bd.Exec("INSERT INTO calificacion (carnet, nombre, curso, nota, semestre, year) VALUES (?, ?, ?, ?, ?, ?)", data.Carnet, data.Nombre, data.Curso, data.Nota, data.Semestre, data.Year)
	if err != nil {
		fmt.Println("ERROR AL INSERTAR DATOS ", err)
		return err
	}
	return err
}

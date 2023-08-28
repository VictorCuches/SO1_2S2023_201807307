package main

import (
	"fmt"
	"io/ioutil"
	"github.com/gofiber/fiber/v2"
	"strings"
)

func main() {
	app := fiber.New()

	app.Get("/get_cpu_info", func(c *fiber.Ctx) error {
		// Ruta al archivo en /proc
		filePath := "/proc/ram_201807307"

		// Leer el contenido del archivo
		content, err := ioutil.ReadFile(filePath)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString("Error al leer el archivo")
		}

		// Parsear el contenido para obtener los valores
		lines := strings.Split(string(content), "\n")
		totalRam := lines[0]
		ramEnUso := lines[1]
		ramLibre := lines[2]
		porcentajeEnUso := lines[3]

		// Formatear los datos en un map
		data := map[string]interface{}{
			"total_ram":       totalRam,
			"ram_en_uso":      ramEnUso,
			"ram_libre":       ramLibre,
			"porcentaje_en_uso": porcentajeEnUso,
		}

		// Enviar los datos como JSON
		return c.JSON(data)
	})

	port := 8080
	fmt.Printf("Servidor backend en ejecución en el puerto %d\n", port)
	err := app.Listen(fmt.Sprintf(":%d", port))
	if err != nil {
		panic(err)
	}
}

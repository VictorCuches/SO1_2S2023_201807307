package main

import (
	"encoding/json"
	"net/http"
)

type Student struct {
	Carnet string `json:"carnet"`
	Nombre string `json:"nombre"`
}

func main() {
	http.HandleFunc("/data", func(w http.ResponseWriter, r *http.Request) {
		// Crear una instancia del estudiante con los datos correspondientes
		student := Student{
			Carnet: "201807307",
			Nombre: "Victor Cuches",
		}

		// Convertir el objeto estudiante a formato JSON
		jsonData, err := json.Marshal(student)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Establecer encabezados de respuesta para JSON
		w.Header().Set("Content-Type", "application/json")
		// Escribir los datos JSON en la respuesta
		w.Write(jsonData)
	})

	// Iniciar el servidor en el puerto 8080
	http.ListenAndServe(":8080", nil)
}

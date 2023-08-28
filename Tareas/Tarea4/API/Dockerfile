# Selecciona una imagen base (en este caso, usamos la imagen oficial de Golang)
FROM golang:1.16

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el código fuente a la imagen
COPY . .

# Compila la aplicación
RUN go build -o main

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 8080

# Comando para ejecutar la aplicación al iniciar el contenedor
CMD ["./main"]

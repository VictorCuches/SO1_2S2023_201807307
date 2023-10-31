FROM golang:1.17-alpine

WORKDIR /app_server
COPY . .

RUN go mod download

EXPOSE 7001

CMD ["go", "run", "main.go"]
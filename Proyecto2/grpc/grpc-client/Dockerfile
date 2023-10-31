FROM golang:1.17-alpine

WORKDIR /app_client
COPY . .

RUN go mod download

EXPOSE 7000

CMD ["go", "run", "main.go"]
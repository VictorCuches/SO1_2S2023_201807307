FROM golang:1.17

WORKDIR /api

COPY . .

RUN go build -o myapp main.go

EXPOSE 8080

CMD ["./myapp"]

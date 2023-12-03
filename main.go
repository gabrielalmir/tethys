package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"task-alerta-alagamento/clients"
	"task-alerta-alagamento/db"
	"task-alerta-alagamento/web"

	"github.com/joho/godotenv"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if r.Method == "OPTIONS" {
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	godotenv.Load()

	MONGODB_URI := os.Getenv("MONGODB_URI")

	DB_HOST := os.Getenv("DB_HOST")
	DB_PORT := os.Getenv("DB_PORT")
	DB_DATABASE := os.Getenv("DB_DATABASE")
	DB_USERNAME := os.Getenv("DB_USERNAME")
	DB_PASSWORD := os.Getenv("DB_PASSWORD")

	PORT := os.Getenv("PORT")

	if PORT == "" {
		PORT = "8000"
	}

	clients.AwakeSmsService(clients.SmsBaseURL)

	database := db.NewDatabase(DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD)
	mongoInstance, err := db.NewMongo(MONGODB_URI)
	if err != nil {
		log.Fatal(err)
	}

	server := web.NewServer(mongoInstance, database)

	http.Handle("/notify", corsMiddleware(http.HandlerFunc(server.PostNotify)))
	http.Handle("/notifications", corsMiddleware(http.HandlerFunc(server.GetNotifications)))

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", PORT), nil))
}

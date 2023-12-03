package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"task-alerta-alagamento/clients"
	"task-alerta-alagamento/db"

	"github.com/joho/godotenv"
)

var SmsBaseURL = "https://tethys-sms.onrender.com"
var SmsResource = "enviar-dados"

type Server struct {
	mongo    *db.Mongo
	database *db.Database
}

func NewServer(mongo *db.Mongo, database *db.Database) *Server {
	return &Server{
		mongo:    mongo,
		database: database,
	}
}

type Notify struct {
	Email    string  `json:"email"`
	Rainfall float64 `json:"rainfall"`
	Lake     float64 `json:"lake"`
	Status   string  `json:"status"`
}

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

func (s *Server) postNotify(w http.ResponseWriter, r *http.Request) {
	var notify Notify
	err := json.NewDecoder(r.Body).Decode(&notify)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if notify.Email == "" && notify.Rainfall < 0 && notify.Lake < 0 {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var user db.User
	result := s.database.Conn.Where("email = ?", notify.Email).First(&user)

	if result.Error != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	go s.notifyUser(user, notify)

	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) notifyUser(user db.User, notify Notify) {
	smsService := clients.NewSmsService(SmsBaseURL, SmsResource)

	message := fmt.Sprintf(
		"Olá, %s. O nível do lago está em %.2f%% e a chuva está em %.2fmm.",
		user.Name,
		notify.Lake,
		notify.Rainfall,
	)

	if notify.Status == "danger" {
		message = fmt.Sprintf(
			"Olá, %s. O nível do lago está em %.2f%% e a chuva está em %.2fmm. O nível do lago está acima do limite de segurança.",
			user.Name,
			notify.Lake,
			notify.Rainfall,
		)
	}

	if notify.Status == "critical" {
		message = fmt.Sprintf(
			"Atenção, %s. Alerta de alagamento! O nível do lago está em %.2f%% e a chuva está em %.2fmm. O nível do lago está acima do limite crítico.",
			user.Name,
			notify.Lake,
			notify.Rainfall,
		)
	}

	smsService.Send(user.Phone, message)

	notification := db.NewNotification(
		user.Email,
		user.PostalCode,
		"Blumenau",
		"Centro",
		"SC",
		notify.Rainfall,
		notify.Lake,
		"BLUMENAU_CENTRO",
		"-26.9239862",
		"-49.0641133",
	)

	err := s.mongo.Insert("tethys", "notifications", notification)

	if err != nil {
		log.Fatal(err)
	}
}

func (s *Server) getNotifications(w http.ResponseWriter, r *http.Request) {
	notifications, err := s.mongo.FindAll("tethys", "notifications")

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(notifications)
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

	clients.AwakeSmsService(SmsBaseURL)

	database := db.NewDatabase(DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD)
	mongoInstance, err := db.NewMongo(MONGODB_URI)
	if err != nil {
		log.Fatal(err)
	}

	server := NewServer(mongoInstance, database)

	http.Handle("/notify", corsMiddleware(http.HandlerFunc(server.postNotify)))
	http.Handle("/notifications", corsMiddleware(http.HandlerFunc(server.getNotifications)))

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", PORT), nil))
}

package web

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"task-alerta-alagamento/clients"
	"task-alerta-alagamento/db"
	"task-alerta-alagamento/dtos"
)

func (s *Server) PostNotify(w http.ResponseWriter, r *http.Request) {
	var notify dtos.Notify
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

	go s.NotifyUser(user, notify)

	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) NotifyUser(user db.User, notify dtos.Notify) {
	smsService := clients.NewSmsService(clients.SmsBaseURL, clients.SmsResource)

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

func (s *Server) GetNotifications(w http.ResponseWriter, r *http.Request) {
	notifications, err := s.mongo.FindAll("tethys", "notifications")

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(notifications)
}

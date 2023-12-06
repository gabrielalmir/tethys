package web

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
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
	whatsappService := clients.NewWhatsAppService(clients.WhatsAppBaseURL, clients.WhatsAppResource)
	brasilApiService := clients.NewBrasilApiService(clients.BrasilApiBaseURL)

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

	go smsService.Send(user.Phone, message)
	go whatsappService.Send(user.Phone, message)

	cep, err := brasilApiService.GetCepV2(user.PostalCode)

	if err != nil {
		log.Fatal(err)
	}

	notification := db.NewNotification(
		user.Email,
		user.PostalCode,
		cep.City,
		cep.Neighborhood,
		cep.State,
		notify.Rainfall,
		notify.Lake,
		fmt.Sprintf("%s_%s", strings.ToUpper(cep.City), strings.ToUpper(cep.Neighborhood)),
		cep.Location.Coordinates.Latitude,
		cep.Location.Coordinates.Longitude,
	)

	err = s.mongo.Insert("tethys", "notifications", notification)

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

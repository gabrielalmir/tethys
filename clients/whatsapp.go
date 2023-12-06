package clients

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
)

var WhatsAppBaseURL = "https://tethys-wpp.onrender.com"
var WhatsAppResource = "enviar-dados"

type WhatsAppService struct {
	BaseURL  string
	Resource string
}

func NewWhatsAppService(baseURL string, resource string) *WhatsAppService {
	return &WhatsAppService{
		BaseURL:  baseURL,
		Resource: resource,
	}
}

func (s *WhatsAppService) Send(phone string, message string) error {
	fmt.Printf("Sending SMS to %s with message %s\n", phone, message)

	phone = strings.Map(func(r rune) rune {
		if '0' <= r && r <= '9' {
			return r
		}
		return -1
	}, phone)

	if !strings.HasPrefix(phone, "+") {
		phone = "+55" + phone
	}

	data := url.Values{}
	data.Set("numero", phone)
	data.Set("texto", message)

	url := fmt.Sprintf("%s/%s", s.BaseURL, s.Resource)

	resp, err := http.PostForm(url, data)
	if err != nil {
		log.Fatalln(err)
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

	fmt.Println(string(body))

	return nil
}

func AwakeWhatsappService(baseURL string) {
	log.Println("Awaking WhatsApp service...")
	http.Get(baseURL)
}

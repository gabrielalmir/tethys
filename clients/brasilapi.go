package clients

import (
	"encoding/json"
	"log"
	"net/http"
)

var BrasilApiBaseURL = "https://brasilapi.com.br/api"

type BrasilApiService struct {
	BaseURL string
}

type CepV2 struct {
	Cep          string   `json:"cep"`
	State        string   `json:"state"`
	City         string   `json:"city"`
	Neighborhood string   `json:"neighborhood"`
	Street       string   `json:"street"`
	Service      string   `json:"service"`
	Location     Location `json:"location"`
}

type Location struct {
	Type        string      `json:"type"`
	Coordinates Coordinates `json:"coordinates"`
}

type Coordinates struct {
	Latitude  string `json:"latitude"`
	Longitude string `json:"longitude"`
}

func NewBrasilApiService(baseURL string) *BrasilApiService {
	return &BrasilApiService{
		BaseURL: baseURL,
	}
}

func (b *BrasilApiService) GetCepV2(cep string) (CepV2, error) {
	url := b.BaseURL + "/cep/v2/" + cep

	resp, err := http.Get(url)
	if err != nil {
		log.Fatalln(err)
	}

	defer resp.Body.Close()

	var result CepV2

	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		log.Fatalln(err)
	}

	return result, nil
}

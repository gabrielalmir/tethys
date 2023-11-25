export interface BrasilApiCep {
  cep:          string;
  state:        string;
  city:         string;
  neighborhood: string;
  street:       string;
  service:      string;
  location:     Location;
}

export interface Location {
  type:        string;
  coordinates: Coordinates;
}

export interface Coordinates {
  longitude: string;
  latitude:  string;
}

export class BrasilApiService {
  private baseURL = "https://brasilapi.com.br/api";

  constructor(private http: HttpClient) {}

  async getPostalCode(postalCode: string): Promise<BrasilApiCep> {
    const brasilUrl = `${this.baseURL}/cep/v2/${postalCode}`;
    const brasilResponse = await this.http(brasilUrl);

    if (brasilResponse.status !== 200) {
      throw new Error(`Não foi possível encontrar o CEP ${postalCode}`);
    }

    return await brasilResponse.json();
  }
}

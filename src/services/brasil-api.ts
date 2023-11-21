export class BrasilApiService {
  private baseURL = "https://brasilapi.com.br/api";

  constructor(private http: HttpClient) {}

  async getPostalCode(postalCode: string): Promise<{ latitude: string, longitude: string }> {
    const brasilUrl = `${this.baseURL}/cep/v2/${postalCode}`;
    const brasilResponse = await this.http(brasilUrl);

    if (brasilResponse.status !== 200) {
      console.log(`Não foi possível encontrar o CEP ${postalCode} em ${brasilUrl}`)
      return { latitude: '', longitude: '' }
    }

    const json = await brasilResponse.json();
    const { coordinates } = json.location;

    if (!coordinates) {
      console.log(`Não foi possível encontrar as coordenadas para o CEP ${postalCode}`)
      return { latitude: '', longitude: '' }
    }

    const { latitude, longitude } = coordinates;

    return { latitude, longitude };
  }
}

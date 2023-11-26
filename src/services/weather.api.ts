export class WeatherService {
  private baseURL = "https://tethys-api-pluviometrico.onrender.com";

  async getRainfall(
    latitude: string | number,
    longitude: string | number
  ): Promise<{ rainfall: number }> {
    const rainfallUrl = `${this.baseURL}/weather/1,${latitude},${longitude}`;
    const rainfallResponse = await fetch(rainfallUrl);
    const json = await rainfallResponse.json();

    if (rainfallResponse.status !== 200) {
      console.log(`Não foi possível encontrar o índice de chuva em ${rainfallUrl}`)
      return { rainfall: 0 }
    }

    const { value: rainfall } = json[0];


    return { rainfall };
  }

  async getLakeVolume() : Promise<{ volume: number }> {
    const random = Math.floor(Math.random() * 100);
    return { volume: random };
  }
}

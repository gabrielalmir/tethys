import random
import requests

class WeatherService:
    base_url = "https://tethys-api-pluviometrico.onrender.com"

    def get(self, lat, lon):
        print(f"Buscando dados de chuva para {lat},{lon}")
        url = f"{self.base_url}/weather/1,{lat},{lon}"
        response = requests.get(url)
        result = response.json()

        if result is None or len(result) == 0:
            raise Exception(f"Could not find weather for {lat},{lon}")

        return result[0]["value"]

    def get_lake_volume(self):
        return { "volume": random.randint(0, 100) }

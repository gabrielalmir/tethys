import requests

class BrasilApi:
    def __init__(self):
        self.url = 'https://brasilapi.com.br/api/cep/v2/'

    def get(self, cep: str):
        print(f"Buscando endereço para o CEP {cep}")
        response = requests.get(self.url + cep)
        result = response.json()

        if result["location"] is None:
            raise Exception(f"Nenhum endereço encontrado para o CEP {cep}")

        return result



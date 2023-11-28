import requests

class SmsService:
    base_url = "https://tethys-sms.onrender.com"

    def __init__(self):
        self.url = self.base_url + "/enviar-dados"

    def send(self, phone: str, message: str):
        print(f"Enviando SMS para {phone}")

        phone = ''.join(filter(str.isdigit, phone))
        if not phone.startswith('+'): phone = '+55' + phone

        headers = { "Content-Type":  "application/x-www-form-urlencoded" }
        data = { "numero": phone, "texto": message }
        response = requests.post(self.url, headers=headers, data=data)
        return response.json()

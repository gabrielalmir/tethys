from services.brasil_api import BrasilApi
from services.weather_api import WeatherService
from services.database import DatabaseService
from interfaces.notification_service import NotificationService

from services.mongodb import MongoService

from datetime import datetime

class Notifier:
    mongo = MongoService()

    def __init__(self, brasil_api: BrasilApi, weather_api: WeatherService,
                 notification_service: NotificationService, database_service: DatabaseService):
        self.brasil_api = brasil_api
        self.weather_api = weather_api
        self.notification_service = notification_service
        self.database_service = database_service

    def notify_users(self):
        for user in self.database_service.get_users():
            if user.email is None:
                continue
            self.notify_user(user)

    def notify_user(self, user):
        lake_volume = self.weather_api.get_lake_volume()
        self.validate_user(user)

        print(f"Usuário {user.name} possui CEP cadastrado")
        postal_code = user.postalcode
        postal_code_data = self.brasil_api.get(postal_code)

        print(f"CEP {postal_code} pertence a cidade {postal_code_data['city']} e bairro {postal_code_data['neighborhood']}")
        tag_city_neightborhood = f"{postal_code_data['city']}_{postal_code_data['neighborhood']}".upper()

        rainfall = self.weather_api.get(postal_code_data["location"]["coordinates"]["latitude"], postal_code_data["location"]["coordinates"]["longitude"])
        message = self.get_notification_message(user, rainfall, lake_volume["volume"])

        print(f"Enviando notificação para {user.email} com a mensagem: {message}")
        self.notification_service.send_notification(user, message)

        print(f"Salvando dados no MongoDB")
        self.mongo.set_document('notifications', {
            "email": user.email,
            "postalcode": postal_code,
            "city": postal_code_data["city"],
            "neighborhood": postal_code_data["neighborhood"],
            "state": postal_code_data["state"],
            "rainfall": rainfall,
            "lake_volume": lake_volume["volume"],
            "tag": tag_city_neightborhood,
            "latitude": postal_code_data["location"]["coordinates"]["latitude"],
            "longitude": postal_code_data["location"]["coordinates"]["longitude"],
            "timestamp": datetime.now()
        })

    def validate_user(self, user):
        if user.postalcode is None:
            raise Exception(f"Usuário {user.name} não possui CEP cadastrado")

    def get_notification_message(self, user, rainfall, lake_volume):
        return f"Olá {user.name}, o volume do lago é de {lake_volume} e a previsão de chuva para sua região é de {rainfall}mm"

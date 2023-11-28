import dotenv
import asyncio

from fastapi import FastAPI
from services.notifier import Notifier
from services.brasil_api import BrasilApi
from services.weather_api import WeatherService
from services.database import DatabaseService
from services.sms_notication import SmsNotificationService
from services.sms_api import SmsService
from pydantic import BaseModel

dotenv.load_dotenv()

app = FastAPI()

brasil_api = BrasilApi()
weather_api = WeatherService()
database_service = DatabaseService()
notification_service = SmsNotificationService(sms_service=SmsService())
notifier = Notifier(
    brasil_api=brasil_api,
    weather_api=weather_api,
    notification_service=notification_service,
    database_service=database_service
)

class Notification(BaseModel):
    email: str

@app.post('/notify')
async def notify(notification: Notification):
    try:
        asyncio.create_task(notifier.notify_user(database_service.get_user(notification.email)))
        return {'message': f'Notificação enfileirada com sucesso para o {notification.email}'}
    except Exception as e:
        return {'error': f'Erro ao enfileirar notificação para o {notification.email}: {e}'}



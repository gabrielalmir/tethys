from interfaces.notification_service import NotificationService
from services.sms_api import SmsService
from services.database import User

class SmsNotificationService(NotificationService):
    def __init__(self, sms_service: SmsService):
        self.sms_service = sms_service

    def send_notification(self, user: User, message: str) -> None:
        print(f"Enviando SMS para {user.name}")
        phone = user.phone
        if not phone:
            raise Exception("Número de telefone não encontrado")

        result = self.sms_service.send(phone, message)
        print(f"SMS enviado com sucesso para {user.name}\n{result}")

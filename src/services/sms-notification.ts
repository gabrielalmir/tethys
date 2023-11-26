import { users } from "@prisma/client";
import { NotificationService } from "../interfaces/notification-service";
import { SmsService } from "./sms-api";

export class SmsNotificationService implements NotificationService {
  constructor(private smsService: SmsService) {}

  async sendNotification(user: users, message: string): Promise<void> {
    const { phone } = user;
    if (!phone) {
      throw new Error("Número de telefone não encontrado");
    }
    await this.smsService.sendSms(phone, message);
  }
}

import { users } from "@prisma/client";

export interface NotificationService {
  sendNotification(user: users, message: string): Promise<void>;
}

import { PrismaClient, users } from "@prisma/client";
import { BrasilApiService } from "./brasil-api";

import { SmsService } from "./sms-api";
import { WeatherService } from "./weather.api";

import { InfluxDBClient, Point } from "@influxdata/influxdb3-client";

// Define an interface for the notification service
interface NotificationService {
  sendNotification(user: users, message: string): Promise<void>;
}

// Implement the SMS service
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

export class UserNotifier {
  private influxdb: InfluxDBClient;

  constructor(
    private brasilApiService: BrasilApiService,
    private weatherService: WeatherService,
    private notificationService: NotificationService,
    private prisma: PrismaClient
  ) {
    this.influxdb = new InfluxDBClient({
      host: process.env.INFLUXDB_HOST ?? "localhost",
      token: process.env.INFLUXDB_TOKEN,
    });
  }

  async notifyUsers() {
    const users = await this.prisma.users.findMany();

    console.log(`Enviando notificações para ${users.length} usuários`);

    for (const user of users) {
      await this.notifyUser(user);
    }

    console.log(`Notificações enviadas para ${users.length} usuários`);

    this.influxdb.close();
  }

  public async notifyUser(user: users) {
    try {
      const lakeVolume = await this.weatherService.getLakeVolume();
      this.validateUser(user);

      const { postalcode } = user;

      console.log(`Buscando dados para o CEP ${postalcode}`);

      if (!postalcode) {
        throw new Error("CEP não encontrado");
      }

      const postalCodeData = await this.brasilApiService.getPostalCode(
        postalcode
      );

      const tagCityNeightborhood =
        `${postalCodeData.city}_${postalCodeData.neighborhood}`.toUpperCase();

      console.log(
        `Buscando dados de chuva para ${tagCityNeightborhood} (${postalCodeData.location.coordinates.latitude}, ${postalCodeData.location.coordinates.longitude})`
      );

      const { rainfall } = await this.weatherService.getRainfall(
        postalCodeData.location.coordinates.latitude,
        postalCodeData.location.coordinates.longitude
      );

      if (rainfall !== 0 && !rainfall) {
        throw new Error("Não foi possível encontrar o índice de chuva");
      }

      console.log(`Enviando notificação para ${user.name}`);

      const message = this.getNotificationMessage(user, rainfall, lakeVolume.volume);

      // Use the notification service to send the notification
      await this.notificationService.sendNotification(user, message);

      console.log(`Notificação enviada para ${user.name}`);

      const points = [
        Point.measurement("notifications")
          .setStringField("postal_code", postalcode)
          .setStringField("city", postalCodeData.city)
          .setStringField("neighborhood", postalCodeData.neighborhood)
          .setStringField("state", postalCodeData.state)
          .setIntegerField("rainfall", rainfall)
          .setIntegerField("lake_volume", lakeVolume.volume)
          .setTimestamp(new Date()),
      ];

      this.influxdb
        .write(points, "tethys")
        .then(() => console.log("Dados enviados para o InfluxDB"));
    } catch (error: any) {
      console.log(error.message);
    }
  }

  public getNotificationMessage(user: users, rainfall: number, lakeVolume: number) {
    const { name, postalcode } = user;

    let message = `Olá, ${name}!`;

    if (rainfall + lakeVolume > 80) {
      message += ` Atenção, o índice de chuva para o CEP ${postalcode} está em ${rainfall}mm.`;
      message += ` O volume do lago é de ${lakeVolume}%. Por favor, tome cuidado!`;
    } else {
      message += ` O índice de chuva para o CEP ${postalcode} está em ${rainfall}mm.`;
      message += ` O volume do lago é de ${lakeVolume}%. Indice de chuva e volume do lago estão dentro da normalidade.`;
    }

    return message;
  }

  private validateUser(user: users) {
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (!user.postalcode) {
      throw new Error("CEP não encontrado");
    }

    if (!user.phone) {
      throw new Error("Número de telefone não encontrado");
    }
  }
}

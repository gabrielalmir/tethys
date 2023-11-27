import { PrismaClient, users } from "@prisma/client";
import { MongoClient, ServerApiVersion } from "mongodb";

import { NotificationService } from "../interfaces/notification-service";
import { BrasilApiService } from "./brasil-api";
import { WeatherService } from "./weather.api";

export class Notifier {
  private datalake: MongoClient;

  constructor(
    private brasilApiService: BrasilApiService,
    private weatherService: WeatherService,
    private notificationService: NotificationService,
    private prisma: PrismaClient
  ) {
    this.datalake = new MongoClient(process.env.MONGODB_URI as string, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
  }

  async notifyUsers() {
    const users = await this.prisma.users.findMany();

    console.log(`Enviando notificações para ${users.length} usuários`);

    for (const user of users) {
      await this.notifyUser(user);
    }

    console.log(`Notificações enviadas para ${users.length} usuários`);

    this.datalake.close();
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

      const message = this.getNotificationMessage(
        user,
        rainfall,
        lakeVolume.volume
      );

      // Use the notification service to send the notification
      await this.notificationService.sendNotification(user, message);

      console.log(`Notificação enviada para ${user.name}`);

      this.datalake.connect()
        .then(() => {
          console.log("Conectado ao MongoDB");
          const db = this.datalake.db("tethys");
          const collection = db.collection("notifications");
          const document = {
            postal_code: postalcode,
            city: postalCodeData.city,
            neighborhood: postalCodeData.neighborhood,
            state: postalCodeData.state,
            rainfall,
            lake_volume: lakeVolume.volume,
            timestamp: new Date(),
          };

          collection.insertOne(document)
            .then(() => console.log("Dados enviados para o MongoDB"))
            .catch((error) => console.log(error.message));
        })
        .catch((error) => console.log(error.message));
    } catch (error: any) {
      console.log(error.message);
    }
  }

  public getNotificationMessage(
    user: users,
    rainfall: number,
    lakeVolume: number
  ) {
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

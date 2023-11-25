import { PrismaClient, users } from "@prisma/client";
import { BrasilApiService } from "./brasil-api";
import { SmsService } from "./sms-api";
import { WeatherService } from "./weather.api";

import { InfluxDBClient, Point } from "@influxdata/influxdb3-client";

export class UserNotifier {
  private influxdb = new InfluxDBClient({
    host: "https://us-east-1-1.aws.cloud2.influxdata.com",
    token: process.env.INFLUXDB_TOKEN,
  });

  constructor(
    private brasilApiService: BrasilApiService,
    private weatherService: WeatherService,
    private smsService: SmsService,
    private prisma: PrismaClient
  ) {}

  async notifyUsers() {
    const users = await this.prisma.users.findMany();

    console.log(`Enviando SMS para ${users.length} usuários`);

    users.map(async (user) => {
      console.log(`Enviando SMS para ${user.phone}`);
      await this.notifyUser(user);
    });

    console.log(`SMS enviado para ${users.length} usuários`);

    this.influxdb.close();
  }

  public async notifyUser(user: users) {
    try {
      const lakeVolume = await this.weatherService.getLakeVolume();
      this.validateUser(user);

      const { postalcode, phone } = user;

      console.log(`Buscando dados para o CEP ${postalcode}`);

      if (!postalcode) {
        throw new Error("CEP não encontrado");
      }

      const postalCodeData = await this.brasilApiService.getPostalCode(
        postalcode
      );

      const { latitude, longitude } = postalCodeData.location.coordinates;

      if (!latitude || !longitude) {
        throw new Error("Não foi possível encontrar as coordenadas do CEP");
      }

      const tagCityNeightborhood = `${postalCodeData.city}_${postalCodeData.neighborhood}`.toUpperCase();

      console.log(
        `Buscando dados de chuva para ${tagCityNeightborhood} (${latitude}, ${longitude})`
      );

      const { rainfall } = await this.weatherService.getRainfall(
        latitude,
        longitude
      );

      if (rainfall !== 0 && !rainfall) {
        console.log(await this.weatherService.getRainfall(latitude, longitude));
        throw new Error("Não foi possível encontrar o índice de chuva");
      }

      console.log(`Enviando SMS para ${phone}`);

      if (!phone) {
        throw new Error("Número de telefone não encontrado");
      }

      let message = `Olá, ${user.name}!\nO índice de chuva para o CEP ${postalcode} é de ${rainfall}mm.\n`;

      if (lakeVolume.volume > 80) {
        message += `Por favor, fique atento ao nível do lago, que está em ${lakeVolume.volume}%.\n`;
      } else {
        message += `O nível do lago está em ${lakeVolume.volume}%.`;
      }

      message += `\n\nAtenciosamente,\nEquipe Tethys`;

      await this.smsService.sendSms(phone, message);

      console.log(`SMS enviado para ${phone}`);

      const points = [
        Point.measurement("notifications")
        .setStringField("postal_code", postalcode)
        .setStringField("city", postalCodeData.city)
        .setStringField("neighborhood", postalCodeData.neighborhood)
        .setStringField("state", postalCodeData.state)
        .setIntegerField("rainfall", rainfall)
        .setIntegerField("lake_volume", lakeVolume.volume)
        .setTimestamp(new Date())
      ]

      this.influxdb.write(points, "tethys")
        .then(() => console.log("Dados enviados para o InfluxDB"))


    } catch (error: any) {
      console.log(error.message);
    }
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

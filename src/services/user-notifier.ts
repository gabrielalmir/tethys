import { PrismaClient, users } from "@prisma/client";
import { BrasilApiService } from "./brasil-api";
import { SmsService } from "./sms-api";
import { WeatherService } from "./weather.api";

export class UserNotifier {
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
  }

  public async notifyUser(user: users) {
    try {
      this.validateUser(user);

      const { postalcode, phone } = user;

      console.log(`Buscando dados para o CEP ${postalcode}`);

      if (!postalcode) {
        throw new Error("CEP não encontrado");
      }

      const { latitude, longitude } = await this.brasilApiService.getPostalCode(
        postalcode
      );

      if (!latitude || !longitude) {
        throw new Error("Não foi possível encontrar as coordenadas do CEP");
      }

      console.log(
        `Buscando dados de chuva para latitude ${latitude} e longitude ${longitude}`
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

      let message = `
        Olá, ${user.name}!\n
        O índice de chuva para o CEP ${postalcode} é de ${rainfall}mm.\n
        Tenha um bom dia!\n\n
        Equipe Tethys - Alerta de Alagamentos
      `;

      await this.smsService.sendSms(phone, message);

      console.log(`SMS enviado para ${phone}`);
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

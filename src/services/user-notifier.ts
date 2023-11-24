import { PrismaClient, User } from "@prisma/client";
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
    const users = await this.prisma.user.findMany();

    console.log(`Enviando SMS para ${users.length} usuários`);

    users.map(async (user) => {
      console.log(`Enviando SMS para ${user.phoneNumber}`);
      await this.notifyUser(user);
    });
  }

  private async notifyUser(user: User) {
    try {
      this.validateUser(user);

      const { postalCode, phoneNumber } = user;

      console.log(`Buscando dados para o CEP ${postalCode}`);

      const { latitude, longitude } = await this.brasilApiService.getPostalCode(
        postalCode
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

      console.log(`Enviando SMS para ${phoneNumber}`);

      await this.smsService.sendSms(
        phoneNumber,
        `Olá! O índice de chuva na sua região é de ${rainfall} mm`
      );

      console.log(`SMS enviado para ${phoneNumber}`);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  private validateUser(user: User) {
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (!user.postalCode) {
      throw new Error("CEP não encontrado");
    }

    if (!user.phoneNumber) {
      throw new Error("Número de telefone não encontrado");
    }
  }
}

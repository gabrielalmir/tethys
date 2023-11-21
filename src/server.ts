import { PrismaClient, User } from "@prisma/client";
import fastify from "fastify";
import cron from "node-cron";
import { BrasilApiService } from "./services/brasil-api";
import { SmsService } from "./services/sms-api";
import { WeatherService } from "./services/weather.api";

const app = fastify();
const prisma = new PrismaClient();

cron.schedule('*/10 * * * * *', async () => {
  const users = await prisma.user.findMany()

  console.log(`Enviando SMS para ${users.length} usuários`)

  users.map(async (user) => {
    try {
      validateUser(user);

      const { postalCode, phoneNumber } = user;

      console.log(`Buscando dados para o CEP ${postalCode}`)

      const brasilApiService = new BrasilApiService(fetch);
      const { latitude, longitude } = await brasilApiService.getPostalCode(postalCode);

      if (!latitude || !longitude) {
        throw new Error("Não foi possível encontrar as coordenadas do CEP");
      }

      console.log(`Buscando dados de chuva para latitude ${latitude} e longitude ${longitude}`)

      const weatherService = new WeatherService(fetch);
      const { rainfall } = await weatherService.getRainfall(
        latitude,
        longitude
      );

      if (rainfall !== 0 && !rainfall) {
        console.log(await weatherService.getRainfall(latitude, longitude))
        throw new Error("Não foi possível encontrar o índice de chuva");
      }

      console.log(`Enviando SMS para ${phoneNumber}`)

      const smsService = new SmsService(fetch);
      await smsService.sendSms(phoneNumber, `Olá! O índice de chuva na sua região é de ${rainfall} mm`);

      console.log(`SMS enviado para ${phoneNumber}`);
    } catch (error: any) {
      console.log(error.message);
    }
  })
});

function validateUser(user: User) {
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

app
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => console.log("server running ..."));

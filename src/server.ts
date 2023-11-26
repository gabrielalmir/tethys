import { PrismaClient } from "@prisma/client";
import fastify from "fastify";

import { fastifyCors } from "@fastify/cors";
import { BrasilApiService } from "./services/brasil-api";
import { SmsService } from "./services/sms-api";
import { SmsNotificationService } from "./services/sms-notification";
import { WeatherService } from "./services/weather.api";

import { z } from 'zod';
import { Notifier } from "./services/notifier";

const app = fastify();

const prisma = new PrismaClient();
const brasilApiService = new BrasilApiService();
const weatherService = new WeatherService();
const smsService = new SmsService();
const smsNotificationService = new SmsNotificationService(smsService);

app.register(fastifyCors, {
  origin: "*"
});

app.post("/notify", async (request, reply) => {
  const createNotificationSchema = z.object({
    email: z.string().email(),
  });

  const { email } = createNotificationSchema.parse(request.body);

  // Não aguardar a notificação aqui, apenas enfileirar
  queueUserNotificationSms(email);

  // Responder imediatamente, sem esperar pela notificação
  return { message: "Notificação enfileirada com sucesso" };
});

async function queueUserNotificationSms(email: string) {
  console.log(`Enfileirando notificação para ${email}`);

  const notifier = new Notifier(
    brasilApiService,
    weatherService,
    smsNotificationService,
    prisma
  );

  // Processo assíncrono em segundo plano
  setImmediate(async () => {
    const user = await prisma.users.findFirst({ where: { email } });

    if (!user) {
      console.error("Usuário não encontrado");
      return;
    }

    // Notificar o usuário
    await notifier.notifyUser(user);

    console.log(`Notificação enviada para ${email}`);
  });
}

app
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => console.log("server running ..."));

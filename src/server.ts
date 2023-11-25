import { PrismaClient } from "@prisma/client";
import fastify from "fastify";

import { BrasilApiService } from "./services/brasil-api";
import { SmsService } from "./services/sms-api";
import { UserNotifier } from "./services/user-notifier";
import { WeatherService } from "./services/weather.api";

import { z } from 'zod';

const app = fastify();

const userNotifier = new UserNotifier(
  new BrasilApiService(fetch),
  new WeatherService(fetch),
  new SmsService(fetch),
  new PrismaClient(),
);

const prisma = new PrismaClient();

app.post("/notify", async (request, reply) => {
  const createNotificationSchema = z.object({
    email: z.string().email(),
  });

  const { email } = createNotificationSchema.parse(request.body);

  // Não aguardar a notificação aqui, apenas enfileirar
  queueUserNotification(email);

  // Responder imediatamente, sem esperar pela notificação
  return { message: "Notificação enfileirada com sucesso" };
});

async function queueUserNotification(email: string) {
  console.log(`Enfileirando notificação para ${email}`);

  // Processo assíncrono em segundo plano
  setImmediate(async () => {
    const user = await prisma.users.findFirst({ where: { email } });

    if (!user) {
      console.error("Usuário não encontrado");
      return;
    }

    // Notificar o usuário
    await userNotifier.notifyUser(user);

    console.log(`Notificação enviada para ${email}`);
  });
}


app
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => console.log("server running ..."));

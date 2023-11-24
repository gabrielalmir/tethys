import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import cron from "node-cron";

import { BrasilApiService } from "./services/brasil-api";
import { SmsService } from "./services/sms-api";
import { UserNotifier } from "./services/user-notifier";
import { WeatherService } from "./services/weather.api";

const app = fastify();

const userNotifier = new UserNotifier(
  new BrasilApiService(fetch),
  new WeatherService(fetch),
  new SmsService(fetch),
  new PrismaClient()
);

const EVERY_DAY = "0 0 * * *";

cron.schedule(EVERY_DAY, async () => {
  console.log("Iniciando notificação de usuários");
  await userNotifier.notifyUsers();
});

app.post('/notify', async (request, reply) => {
  console.log("Iniciando notificação de usuários");
  await userNotifier.notifyUsers()
  reply.send('ok')
})

app
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => console.log("server running ..."));

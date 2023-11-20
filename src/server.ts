import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import cron from "node-cron";

const app = fastify();
const prisma = new PrismaClient();

const brasilApi = "https://brasilapi.com.br/api";
const rainfallApi = "https://tethys-api-pluviometrico.onrender.com";
const envioSmsApi = "https://tethys-sms.onrender.com";

cron.schedule('*/30 * * * * *', async () => {
  const users = await prisma.user.findMany()

  console.log(`Enviando SMS para ${users.length} usuários`)

  users.map(async (user) => {
    console.log(`Enviando SMS para o usuário ${user.id}`)
    const { postalCode, phoneNumber } = user

    if (!postalCode || !phoneNumber) {
      console.log(`Usuário ${user.id} não possui CEP ou telefone cadastrado`)
      return;
    }

    const brasilUrl = `${brasilApi}/cep/v2/${postalCode}`;
    const brasilResponse = await fetch(brasilUrl);

    if (brasilResponse.status !== 200) {
      console.log(`Não foi possível encontrar o CEP ${postalCode} em ${brasilUrl}`)
      return;
    }

    const json = await brasilResponse.json();
    const { coordinates } = json.location;

    if (!coordinates) {
      console.log(`Não foi possível encontrar as coordenadas para o CEP ${postalCode}`)
      return;
    }

    const { latitude, longitude } = coordinates;

    const rainfallUrl = `${rainfallApi}/weather/1,${latitude},${longitude}`;
    const rainfallResponse = await fetch(rainfallUrl);

    console.log(`Chuva para o CEP ${postalCode}: ${rainfallResponse.status}`)

    if (rainfallResponse.status === 200) {
      const rainfallResults = await rainfallResponse.json();
      const { value } = rainfallResults[0];

      if (value >= 30) {
        const url = `${envioSmsApi}/enviar-dados`;
        const message = `Alerta de alagamento! O CEP ${postalCode} está com ${value}mm de chuva.`
        const localizedPhoneNumber = phoneNumber.includes("+") ? phoneNumber : `+55${phoneNumber}`

        console.log(`Enviando SMS para o usuário ${user.id}`)

        const result = await fetch(url, {
          method: "post",
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({ numero: localizedPhoneNumber, texto: message }),
        });

        if (result.status === 200) {
          console.log(`SMS enviado para o usuário ${user.id}`)
        } else {
          console.log(`Não foi possível enviar SMS para o usuário ${user.id}`)
        }
      }

      console.log(`Chuva para o CEP ${postalCode}: ${value}mm`)
    }
  })
});

app
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => console.log("server running ..."));

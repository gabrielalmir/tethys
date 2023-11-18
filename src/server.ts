import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { z } from "zod";

import bcrypt from 'bcrypt';

const app = fastify();
const prisma = new PrismaClient();

app.register(require('fastify-cors'), {
  origin: '*',
  methods: ['GET', 'POST']
});

app.get("/users", async () => {
  const users = await prisma.user.findMany();
  return { users };
});

app.post("/login", async (request, reply) => {
  const createSessionSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = createSessionSchema.parse(request.body);
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return reply.status(404).send({ error: "Usuário não encontrado" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return reply.status(400).send({ error: "Usuário ou senha não correspondem" });
  }

  const { password: _, ...userData } = user;

  return reply.status(200).send({ userData });
});

app.post("/register", async (request, reply) => {
  const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = createUserSchema.parse(request.body);
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    },
  });

  return reply.status(201).send();
});

app.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => console.log('server running ...'))

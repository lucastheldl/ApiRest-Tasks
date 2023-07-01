import { FastifyInstance } from "fastify";
// import { knex } from "../database";

export async function taskRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    return reply.status(201).send();
  });
}

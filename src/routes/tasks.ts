import { FastifyInstance } from "fastify";
import { knex } from "../database";

export async function taskRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const test = await knex("sqlite_schema").select("*");
    return test;
  });
}

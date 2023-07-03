import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "crypto";

export async function taskRoutes(app: FastifyInstance) {
  // Route to get all tasks

  app.get("/", async (request, reply) => {
    const test = await knex("tasks").select("*");
    return test;
  });

  // Route to post a task
  app.post("/", async (request, reply) => {
    const taskSchema = z.object({
      title: z.string(),
      description: z.string(),
    });

    const { title, description } = taskSchema.parse(request.body);

    await knex("tasks").insert({
      id: randomUUID(),
      title,
      description,
    });

    return reply.status(201).send();
  });

  // Route to get a task

  // Route to mark a task as completed

  // Route to edit a task

  // Route to remove a task
}

import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "crypto";

export async function taskRoutes(app: FastifyInstance) {
  // Route to get all tasks

  app.get("/", async () => {
    const tasks = await knex("tasks").select("*");
    return tasks;
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
  app.get("/:id", async (request) => {
    const getTaskParamsSchema = z.object({
      id: z.string().uuid(),
    });
    const { id } = getTaskParamsSchema.parse(request.params);

    const task = await knex("tasks").where("id", id).first();

    return { task };
  });

  // Route to mark a task as completed
  app.patch("/:id", async (request) => {
    const getTaskParamsSchema = z.object({
      id: z.string().uuid(),
    });
    const { id } = getTaskParamsSchema.parse(request.params);
    const date = knex.fn.now();

    const task = await knex("tasks").where("id", id).update({
      completed_at: date,
    });

    return { task };
  });

  // Route to edit a task

  // Route to remove a task
}

import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "crypto";

export async function taskRoutes(app: FastifyInstance) {
  // Route to get all tasks

  app.get("/", async () => {
    const tasks = await knex("tasks").select("*");
    return { tasks };
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
  app.patch("/:id/complete", async (request) => {
    const getTaskParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getTaskParamsSchema.parse(request.params);

    const date = knex.fn.now();

    const task = await knex("tasks").where("id", id).first();

    const updatedTask = await knex("tasks")
      .where("id", id)
      .update({
        completed_at: task.completed_at === null ? date : null,
      });

    return { updatedTask };
  });

  // Route to edit a task
  app.put("/:id", async (request) => {
    const getTaskParamsSchema = z.object({
      id: z.string().uuid(),
      title: z.string().optional(),
      body: z.string().optional(),
    });
    const getTaskBodySchema = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    });

    const { id } = getTaskParamsSchema.parse(request.params);
    const { title, description } = getTaskBodySchema.parse(request.body);
    console.log(title);

    const date = knex.fn.now();

    const updatedTask = await knex("tasks").where("id", id).update(
      {
        title,
        description,
        updated_at: date,
      },
      ["title", "description"]
    );

    return { updatedTask };
  });

  // Route to remove a task
  app.delete("/:id", async (request, reply) => {
    const getTaskParamsSchema = z.object({
      id: z.string().uuid(),
    });
    const { id } = getTaskParamsSchema.parse(request.params);

    await knex("tasks").where("id", id).del();

    return reply.status(200).send();
  });
}

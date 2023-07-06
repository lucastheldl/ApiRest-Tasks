import { app } from "../src/app";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { execSync } from "node:child_process";

describe("Task routes", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex -- migrate:rollback --all");
    execSync("npm run knex -- migrate:latest");
  });

  it("Should be able to post a tasks", async () => {
    const response = await request(app.server).post("/tasks/").send({
      title: "nova tarefa",
      description: "descrição da nova tarefa",
    });

    expect(response.statusCode).toEqual(201);
  });

  it("Should be able to get all tasks", async () => {
    const response = await request(app.server).get("/tasks/");

    expect(response.statusCode).toEqual(200);
  });

  it("Should be able to get especific task", async () => {
    await request(app.server).post("/tasks/").send({
      title: "nova tarefa",
      description: "descrição da nova tarefa",
    });

    const allTasks = await request(app.server).get("/tasks/").expect(200);
    const taskId = allTasks.body.tasks[0].id;

    const especificTask = await request(app.server)
      .get(`/tasks/${taskId}`)
      .expect(200);

    expect(especificTask.body.task).toEqual(
      expect.objectContaining({
        title: "nova tarefa",
        description: "descrição da nova tarefa",
      })
    );
  });

  it("Should be able to mark a task as completed", async () => {
    await request(app.server).post("/tasks/").send({
      title: "nova tarefa",
      description: "descrição da nova tarefa",
    });

    const allTasks = await request(app.server).get("/tasks/").expect(200);
    const taskId = allTasks.body.tasks[0].id;

    const especificTask = await request(app.server)
      .patch(`/tasks/${taskId}/complete`)
      .expect(200);

    expect(especificTask.body).toEqual(
      expect.objectContaining({ updatedTask: 1 })
    );
  });

  it("Should be able to remove a task", async () => {
    await request(app.server).post("/tasks/").send({
      title: "nova tarefa",
      description: "descrição da nova tarefa",
    });

    const allTasks = await request(app.server).get("/tasks/").expect(200);
    const taskId = allTasks.body.tasks[0].id;

    await request(app.server).delete(`/tasks/${taskId}`).expect(200);
  });

  it("Should be able to edit a task", async () => {
    await request(app.server).post("/tasks/").send({
      title: "nova tarefa",
      description: "descrição da nova tarefa",
    });

    const allTasks = await request(app.server).get("/tasks/").expect(200);
    const taskId = allTasks.body.tasks[0].id;

    const especificTask = await request(app.server)
      .put(`/tasks/${taskId}`)
      .send({
        title: "titulo editado",
        description: "descrição editada",
      })
      .expect(200);

    expect(especificTask.body.updatedTask[0]).toEqual(
      expect.objectContaining({
        title: "titulo editado",
        description: "descrição editada",
      })
    );
  });
});

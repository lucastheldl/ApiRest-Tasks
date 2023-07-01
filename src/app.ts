import { fastify } from "fastify";
import { taskRoutes } from "./routes/tasks";

export const app = fastify();

app.register(taskRoutes, { prefix: "tasks" });

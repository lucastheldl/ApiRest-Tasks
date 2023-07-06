import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("tasks", (table) => {
    table.uuid("id").primary();
    table.uuid("session_id").after("id").index();
    table.text("title").notNullable();
    table.text("description").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("completed_at").defaultTo(null);
    table.timestamp("updated_at").defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("tasks");
}

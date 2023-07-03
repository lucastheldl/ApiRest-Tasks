declare module "knex/types/tasks" {
  export interface Tasks {
    id: string;
    title: string;
    description: string;
    created_at: string;
    completed_at: string;
    updated_at: string;
  }
}

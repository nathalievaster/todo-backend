export type Status = "not-started" | "in-progress" | "done";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: Status;
}
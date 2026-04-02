export type Priority = "high" | "medium" | "low";
export type Status = "todo" | "done";

export interface Todo {
  id: number;
  title: string;
  status: Status;
  priority: Priority;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
}

export interface AppData {
  nextId: number;
  todos: Todo[];
}

export interface Stats {
  total: number;
  todo: number;
  done: number;
  byPriority: { high: number; medium: number; low: number };
  overdue: number;
}

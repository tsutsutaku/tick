import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname } from "path";
import { homedir } from "os";
import { join } from "path";
import type { AppData, Todo, Priority, Status, Stats } from "./types.js";

export function defaultDataPath(): string {
  return join(homedir(), ".tick", "data.json");
}

function ensureDir(filePath: string): void {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function loadData(dataPath: string): AppData {
  ensureDir(dataPath);
  if (!existsSync(dataPath)) {
    const initial: AppData = { nextId: 1, todos: [] };
    writeFileSync(dataPath, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
  return JSON.parse(readFileSync(dataPath, "utf-8")) as AppData;
}

export function saveData(dataPath: string, data: AppData): void {
  ensureDir(dataPath);
  writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
}

export interface AddInput {
  title: string;
  priority?: Priority;
  due?: string;
  tag?: string[];
}

export function addTodo(dataPath: string, input: AddInput): Todo {
  const data = loadData(dataPath);
  const now = new Date().toISOString();
  const todo: Todo = {
    id: data.nextId,
    title: input.title,
    status: "todo",
    priority: input.priority ?? "medium",
    tags: input.tag ?? [],
    createdAt: now,
    updatedAt: now,
    dueDate: input.due ?? null,
  };
  data.todos.push(todo);
  data.nextId++;
  saveData(dataPath, data);
  return todo;
}

export interface ListFilters {
  status?: Status | "all";
  priority?: Priority;
  tag?: string;
}

export function listTodos(dataPath: string, filters: ListFilters = {}): Todo[] {
  const data = loadData(dataPath);
  let todos = data.todos;

  const statusFilter = filters.status ?? "all";
  if (statusFilter !== "all") {
    todos = todos.filter((t) => t.status === statusFilter);
  }
  if (filters.priority) {
    todos = todos.filter((t) => t.priority === filters.priority);
  }
  if (filters.tag) {
    todos = todos.filter((t) => t.tags.includes(filters.tag!));
  }
  return todos;
}

export function markDone(dataPath: string, id: number): Todo {
  const data = loadData(dataPath);
  const todo = data.todos.find((t) => t.id === id);
  if (!todo) throw new Error(`Todo with id ${id} not found`);
  todo.status = "done";
  todo.updatedAt = new Date().toISOString();
  saveData(dataPath, data);
  return todo;
}

export interface EditInput {
  title?: string;
  priority?: Priority;
  due?: string;
  tag?: string[];
  status?: Status;
}

export function editTodo(dataPath: string, id: number, changes: EditInput): Todo {
  const data = loadData(dataPath);
  const todo = data.todos.find((t) => t.id === id);
  if (!todo) throw new Error(`Todo with id ${id} not found`);
  if (changes.title !== undefined) todo.title = changes.title;
  if (changes.priority !== undefined) todo.priority = changes.priority;
  if (changes.due !== undefined) todo.dueDate = changes.due;
  if (changes.tag !== undefined) todo.tags = changes.tag;
  if (changes.status !== undefined) todo.status = changes.status;
  todo.updatedAt = new Date().toISOString();
  saveData(dataPath, data);
  return todo;
}

export function deleteTodo(dataPath: string, id: number): Todo {
  const data = loadData(dataPath);
  const index = data.todos.findIndex((t) => t.id === id);
  if (index === -1) throw new Error(`Todo with id ${id} not found`);
  const [todo] = data.todos.splice(index, 1);
  saveData(dataPath, data);
  return todo!;
}

export function getStats(dataPath: string): Stats {
  const data = loadData(dataPath);
  const now = new Date();
  const overdue = data.todos.filter(
    (t) => t.status === "todo" && t.dueDate !== null && new Date(t.dueDate) < now
  ).length;
  return {
    total: data.todos.length,
    todo: data.todos.filter((t) => t.status === "todo").length,
    done: data.todos.filter((t) => t.status === "done").length,
    byPriority: {
      high: data.todos.filter((t) => t.priority === "high").length,
      medium: data.todos.filter((t) => t.priority === "medium").length,
      low: data.todos.filter((t) => t.priority === "low").length,
    },
    overdue,
  };
}

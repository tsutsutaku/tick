import type { Todo, Stats } from "../types.js";

const PRIORITY_COLORS = {
  high: "\x1b[31m",    // red
  medium: "\x1b[33m",  // yellow
  low: "\x1b[32m",     // green
} as const;

const RESET = "\x1b[0m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";

function priorityBadge(p: Todo["priority"]): string {
  return `${PRIORITY_COLORS[p]}[${p.toUpperCase()}]${RESET}`;
}

function statusIcon(s: Todo["status"]): string {
  return s === "done" ? `${DIM}[x]${RESET}` : "[ ]";
}

function formatDue(dueDate: string | null): string {
  if (!dueDate) return "";
  const d = new Date(dueDate);
  const now = new Date();
  const overdue = d < now;
  const str = d.toLocaleDateString("ja-JP");
  return overdue ? ` \x1b[31mdue:${str}(期限超過)${RESET}` : ` ${DIM}due:${str}${RESET}`;
}

export function renderTodo(todo: Todo): string {
  const tags = todo.tags.length > 0 ? ` ${DIM}#${todo.tags.join(" #")}${RESET}` : "";
  const due = formatDue(todo.dueDate);
  const titleStyle = todo.status === "done" ? DIM : "";
  return `${DIM}${todo.id.toString().padStart(3)}${RESET} ${statusIcon(todo.status)} ${titleStyle}${todo.title}${RESET} ${priorityBadge(todo.priority)}${tags}${due}`;
}

export function renderTodoList(todos: Todo[]): void {
  if (todos.length === 0) {
    process.stdout.write("TODOが見つかりません\n");
    return;
  }
  for (const todo of todos) {
    process.stdout.write(renderTodo(todo) + "\n");
  }
}

export function renderAddResult(todo: Todo): void {
  process.stdout.write(`${BOLD}追加しました${RESET} (id: ${todo.id})\n`);
  process.stdout.write(renderTodo(todo) + "\n");
}

export function renderDoneResult(todo: Todo): void {
  process.stdout.write(`${BOLD}完了にしました${RESET} (id: ${todo.id})\n`);
  process.stdout.write(renderTodo(todo) + "\n");
}

export function renderEditResult(todo: Todo): void {
  process.stdout.write(`${BOLD}更新しました${RESET} (id: ${todo.id})\n`);
  process.stdout.write(renderTodo(todo) + "\n");
}

export function renderDeleteResult(todo: Todo): void {
  process.stdout.write(`${BOLD}削除しました${RESET} (id: ${todo.id}): ${todo.title}\n`);
}

export function renderStats(stats: Stats): void {
  process.stdout.write(`${BOLD}=== TODO統計 ===${RESET}\n`);
  process.stdout.write(`合計: ${stats.total}  未完了: ${stats.todo}  完了: ${stats.done}\n`);
  process.stdout.write(`優先度: ${PRIORITY_COLORS.high}高:${stats.byPriority.high}${RESET}  ${PRIORITY_COLORS.medium}中:${stats.byPriority.medium}${RESET}  ${PRIORITY_COLORS.low}低:${stats.byPriority.low}${RESET}\n`);
  if (stats.overdue > 0) {
    process.stdout.write(`\x1b[31m期限超過: ${stats.overdue}件${RESET}\n`);
  }
}

export function renderError(message: string): void {
  process.stderr.write(`\x1b[31mエラー: ${message}${RESET}\n`);
}

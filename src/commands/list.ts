import { listTodos } from "../store.js";
import { renderTodoList, renderError } from "../renderers/text.js";
import { outputSuccess, outputError } from "../renderers/json.js";
import type { Priority, Status } from "../types.js";

export interface ListOptions {
  status?: Status | "all";
  priority?: Priority;
  tag?: string;
  json?: boolean;
  dataPath: string;
}

export function runList(opts: ListOptions): void {
  try {
    const todos = listTodos(opts.dataPath, {
      status: opts.status,
      priority: opts.priority,
      tag: opts.tag,
    });
    if (opts.json) {
      outputSuccess(todos);
    } else {
      renderTodoList(todos);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (opts.json) outputError(msg);
    else renderError(msg);
    process.exit(1);
  }
}

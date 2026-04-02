import { editTodo } from "../store.js";
import { renderEditResult, renderError } from "../renderers/text.js";
import { outputSuccess, outputError } from "../renderers/json.js";
import type { Priority, Status } from "../types.js";

export interface EditOptions {
  title?: string;
  priority?: Priority;
  due?: string;
  tag?: string[];
  status?: Status;
  json?: boolean;
  dataPath: string;
}

export function runEdit(id: string, opts: EditOptions): void {
  try {
    const todo = editTodo(opts.dataPath, parseInt(id, 10), {
      title: opts.title,
      priority: opts.priority,
      due: opts.due,
      tag: opts.tag,
      status: opts.status,
    });
    if (opts.json) {
      outputSuccess(todo);
    } else {
      renderEditResult(todo);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (opts.json) outputError(msg);
    else renderError(msg);
    process.exit(1);
  }
}

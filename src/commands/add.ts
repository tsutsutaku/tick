import { addTodo } from "../store.js";
import { renderAddResult, renderError } from "../renderers/text.js";
import { outputSuccess, outputError } from "../renderers/json.js";
import type { Priority } from "../types.js";

export interface AddOptions {
  priority?: Priority;
  due?: string;
  tag?: string[];
  json?: boolean;
  dataPath: string;
}

export function runAdd(title: string, opts: AddOptions): void {
  try {
    const todo = addTodo(opts.dataPath, {
      title,
      priority: opts.priority,
      due: opts.due,
      tag: opts.tag,
    });
    if (opts.json) {
      outputSuccess(todo);
    } else {
      renderAddResult(todo);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (opts.json) outputError(msg);
    else renderError(msg);
    process.exit(1);
  }
}

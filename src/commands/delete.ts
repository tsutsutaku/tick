import { deleteTodo } from "../store.js";
import { renderDeleteResult, renderError } from "../renderers/text.js";
import { outputSuccess, outputError } from "../renderers/json.js";

export interface DeleteOptions {
  json?: boolean;
  dataPath: string;
}

export function runDelete(id: string, opts: DeleteOptions): void {
  try {
    const todo = deleteTodo(opts.dataPath, parseInt(id, 10));
    if (opts.json) {
      outputSuccess(todo);
    } else {
      renderDeleteResult(todo);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (opts.json) outputError(msg);
    else renderError(msg);
    process.exit(1);
  }
}

import { markDone } from "../store.js";
import { renderDoneResult, renderError } from "../renderers/text.js";
import { outputSuccess, outputError } from "../renderers/json.js";

export interface DoneOptions {
  json?: boolean;
  dataPath: string;
}

export function runDone(id: string, opts: DoneOptions): void {
  try {
    const todo = markDone(opts.dataPath, parseInt(id, 10));
    if (opts.json) {
      outputSuccess(todo);
    } else {
      renderDoneResult(todo);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (opts.json) outputError(msg);
    else renderError(msg);
    process.exit(1);
  }
}

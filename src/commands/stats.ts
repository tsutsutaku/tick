import { getStats } from "../store.js";
import { renderStats, renderError } from "../renderers/text.js";
import { outputSuccess, outputError } from "../renderers/json.js";

export interface StatsOptions {
  json?: boolean;
  dataPath: string;
}

export function runStats(opts: StatsOptions): void {
  try {
    const stats = getStats(opts.dataPath);
    if (opts.json) {
      outputSuccess(stats);
    } else {
      renderStats(stats);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (opts.json) outputError(msg);
    else renderError(msg);
    process.exit(1);
  }
}

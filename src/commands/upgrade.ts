import { execSync } from "child_process";
import { outputSuccess, outputError } from "../renderers/json.js";
import { renderError } from "../renderers/text.js";

export interface UpgradeOptions {
  json?: boolean;
}

export function runUpgrade(opts: UpgradeOptions): void {
  const pkg = "@tsutsutaku/tick";
  try {
    if (!opts.json) {
      process.stdout.write(`最新版にアップグレード中...\n`);
    }
    execSync(`npm install -g ${pkg} --force`, { stdio: opts.json ? "pipe" : "inherit" });
    // 新しいバージョンを取得
    const version = execSync(`npm list -g ${pkg} --depth=0 --json`, { encoding: "utf-8" });
    const parsed = JSON.parse(version) as { dependencies: Record<string, { version: string }> };
    const newVersion = parsed.dependencies?.[pkg]?.version ?? "unknown";
    if (opts.json) {
      outputSuccess({ upgraded: true, version: newVersion });
    } else {
      process.stdout.write(`\x1b[32m✓ アップグレード完了\x1b[0m  ${pkg}@${newVersion}\n`);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (opts.json) outputError(msg);
    else renderError(msg);
    process.exit(1);
  }
}

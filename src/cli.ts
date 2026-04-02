import { Command } from "commander";
import { defaultDataPath } from "./store.js";
import { runAdd } from "./commands/add.js";
import { runList } from "./commands/list.js";
import { runDone } from "./commands/done.js";
import { runEdit } from "./commands/edit.js";
import { runDelete } from "./commands/delete.js";
import { runStats } from "./commands/stats.js";
import { runUpgrade } from "./commands/upgrade.js";
import type { Priority, Status } from "./types.js";

interface GlobalOpts {
  dataPath: string;
  json?: boolean;
  interactive?: boolean;
}

export function buildCli(): Command {
  const program = new Command();

  program
    .name("tick")
    .version("1.0.0")
    .description("AI Agent対応 TODO CLI")
    .option("--data-path <path>", "データファイルのパス", process.env["TICK_DATA_PATH"] ?? defaultDataPath())
    .option("--json", "JSON形式で出力")
    .option("-i, --interactive", "インタラクティブTUIモードで起動");

  // add <title>: (title, localOpts, cmd)
  program
    .command("add <title>")
    .description("TODOを追加する")
    .option("-p, --priority <level>", "優先度 (high|medium|low)", "medium")
    .option("-d, --due <date>", "期限日 (YYYY-MM-DD)")
    .option("-t, --tag <tag...>", "タグ")
    .action((title: string, localOpts: { priority?: Priority; due?: string; tag?: string[] }, cmd: Command) => {
      const global = cmd.optsWithGlobals<GlobalOpts>();
      runAdd(title, { ...localOpts, dataPath: global.dataPath, json: global.json });
    });

  // list: (localOpts, cmd)
  program
    .command("list")
    .description("TODOを一覧表示する")
    .option("-s, --status <status>", "フィルター (todo|done|all)", "all")
    .option("-p, --priority <level>", "優先度フィルター (high|medium|low)")
    .option("-t, --tag <tag>", "タグフィルター")
    .action((localOpts: { status?: Status | "all"; priority?: Priority; tag?: string }, cmd: Command) => {
      const global = cmd.optsWithGlobals<GlobalOpts>();
      runList({ ...localOpts, dataPath: global.dataPath, json: global.json });
    });

  // done <id>: (id, localOpts, cmd)
  program
    .command("done <id>")
    .description("TODOを完了にする")
    .action((id: string, _localOpts: Record<string, never>, cmd: Command) => {
      const global = cmd.optsWithGlobals<GlobalOpts>();
      runDone(id, { dataPath: global.dataPath, json: global.json });
    });

  // edit <id>: (id, localOpts, cmd)
  program
    .command("edit <id>")
    .description("TODOを編集する")
    .option("--title <title>", "新しいタイトル")
    .option("-p, --priority <level>", "優先度 (high|medium|low)")
    .option("-d, --due <date>", "期限日 (YYYY-MM-DD)")
    .option("-t, --tag <tag...>", "タグ")
    .option("-s, --status <status>", "ステータス (todo|done)")
    .action((id: string, localOpts: { title?: string; priority?: Priority; due?: string; tag?: string[]; status?: Status }, cmd: Command) => {
      const global = cmd.optsWithGlobals<GlobalOpts>();
      runEdit(id, { ...localOpts, dataPath: global.dataPath, json: global.json });
    });

  // delete <id>: (id, localOpts, cmd)
  program
    .command("delete <id>")
    .description("TODOを削除する")
    .action((id: string, _localOpts: Record<string, never>, cmd: Command) => {
      const global = cmd.optsWithGlobals<GlobalOpts>();
      runDelete(id, { dataPath: global.dataPath, json: global.json });
    });

  // stats: (localOpts, cmd)
  program
    .command("stats")
    .description("統計を表示する")
    .action((_localOpts: Record<string, never>, cmd: Command) => {
      const global = cmd.optsWithGlobals<GlobalOpts>();
      runStats({ dataPath: global.dataPath, json: global.json });
    });

  // upgrade: (localOpts, cmd)
  program
    .command("upgrade")
    .description("最新版にアップグレードする")
    .action((_localOpts: Record<string, never>, cmd: Command) => {
      const global = cmd.optsWithGlobals<GlobalOpts>();
      runUpgrade({ json: global.json });
    });

  return program;
}

import { buildCli } from "./cli.js";
import { defaultDataPath } from "./store.js";

const isInteractive =
  process.argv.includes("-i") || process.argv.includes("--interactive");

if (isInteractive) {
  // インタラクティブモード: --data-path だけ抽出してTUI起動
  const dpIndex = process.argv.findIndex((a) => a === "--data-path");
  const dataPath =
    dpIndex !== -1 && process.argv[dpIndex + 1]
      ? process.argv[dpIndex + 1]!
      : (process.env["TICK_DATA_PATH"] ?? defaultDataPath());

  const { render } = await import("ink");
  const { default: App } = await import("./ui/App.js");
  render(<App dataPath={dataPath} />);
} else {
  const program = buildCli();
  program.parse();
}

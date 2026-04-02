import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["esm"],
  target: "es2022",
  bundle: true,
  external: ["react", "ink", "ink-text-input"],
  banner: {
    js: "#!/usr/bin/env node",
  },
  clean: true,
});

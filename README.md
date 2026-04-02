# tick ✓

> A CLI TODO manager designed for AI Agents — deterministic output, JSON mode, and a rich interactive TUI.

```
tick add "Deploy to production" -p high -t infra
tick list --json
tick done 3
tick -i
```

---

## Why tick?

Most TODO CLIs are built for humans. **tick** is built for both.

- **AI Agent friendly** — every command outputs structured JSON via `--json`, exits with clear codes, and never emits spinners or animations in non-interactive mode
- **Human friendly** — `tick -i` launches a full-featured terminal UI with keyboard navigation, color-coded priorities, and inline editing
- **Zero dependencies at runtime** — data lives in `~/.tick/data.json`, no database or server required

---

## Installation

```bash
# npm (recommended)
npm install -g @tsutsutaku/tick
```

```bash
# GitHub
npm install -g github:tsutsutaku/tick
```

```bash
# Verify
tick --version
```

---

## Usage

### Add a task

```bash
tick add "Write unit tests"
tick add "Deploy to staging" -p high -d 2026-04-10 -t infra -t devops
```

| Option | Short | Description |
|--------|-------|-------------|
| `--priority <level>` | `-p` | `high` / `medium` (default) / `low` |
| `--due <date>` | `-d` | Due date in `YYYY-MM-DD` format |
| `--tag <tag...>` | `-t` | One or more tags |

---

### List tasks

```bash
tick list                        # all tasks
tick list --status todo          # incomplete only
tick list --status done          # completed only
tick list --priority high        # filter by priority
tick list --tag infra            # filter by tag
tick list --json                 # machine-readable output
```

---

### Complete a task

```bash
tick done 3
```

---

### Edit a task

```bash
tick edit 3 --title "New title"
tick edit 3 -p low --status todo
tick edit 3 -t backend -t api    # replace tags
```

---

### Delete a task

```bash
tick delete 3
```

---

### Stats

```bash
tick stats
tick stats --json
```

---

### Interactive TUI

```bash
tick -i
```

| Key | Action |
|-----|--------|
| `j` / `↓` | Move down |
| `k` / `↑` | Move up |
| `Enter` | Toggle done |
| `a` | Add new task |
| `e` | Edit selected task |
| `d` | Delete selected task |
| `f` | Cycle status filter (all → todo → done) |
| `F` | Cycle priority filter |
| `q` | Quit |

---

## JSON mode (AI Agent)

Every command accepts `--json` as a global flag. Output follows the envelope:

```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "Todo with id 99 not found" }
```

Errors are written to **stderr**, data to **stdout**. Exit codes: `0` = success, `1` = error.

```bash
# Use in scripts / agents
tick list --json | jq '.data[] | select(.status == "todo")'
tick add "Summarize PR" -p high --json
tick done 5 --json
```

---

## Global options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |
| `--data-path <path>` | Custom data file path |
| `-i, --interactive` | Launch TUI mode |

**Environment variable:** `TICK_DATA_PATH` overrides the default data path (`~/.tick/data.json`).

---

## Data schema

```json
{
  "nextId": 4,
  "todos": [
    {
      "id": 1,
      "title": "Deploy to staging",
      "status": "todo",
      "priority": "high",
      "tags": ["infra", "devops"],
      "createdAt": "2026-04-02T10:00:00.000Z",
      "updatedAt": "2026-04-02T10:00:00.000Z",
      "dueDate": "2026-04-10"
    }
  ]
}
```

---

## Tech stack

- [React Ink](https://github.com/vadimdemedes/ink) — React renderer for the terminal
- [Commander.js](https://github.com/tj/commander.js) — CLI argument parsing
- [TypeScript](https://www.typescriptlang.org/) + [tsup](https://tsup.egoist.dev/)

---

## Development

```bash
npm install

# Run without building
npx tsx src/index.tsx add "test task"

# Build
npm run build

# Link globally
npm link
```

---

## License

MIT

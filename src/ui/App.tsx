import React, { useState, useEffect, useCallback } from "react";
import { Box, Text, useInput, useApp } from "ink";
import TodoList from "./TodoList.js";
import FilterBar from "./FilterBar.js";
import StatusBar from "./StatusBar.js";
import AddForm from "./AddForm.js";
import EditForm from "./EditForm.js";
import {
  listTodos,
  markDone,
  deleteTodo,
  addTodo,
  editTodo,
} from "../store.js";
import type { Todo, Priority, Status } from "../types.js";

type Mode = "list" | "add" | "edit";
type StatusFilter = Status | "all";
type PriorityFilter = Priority | "all";

interface Props {
  dataPath: string;
}

export default function App({ dataPath }: Props) {
  const { exit } = useApp();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("list");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [message, setMessage] = useState<string | null>(null);

  const reload = useCallback(() => {
    const filtered = listTodos(dataPath, {
      status: statusFilter,
      priority: priorityFilter === "all" ? undefined : priorityFilter,
    });
    setTodos(filtered);
  }, [dataPath, statusFilter, priorityFilter]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    setSelectedIndex((i) => Math.min(i, Math.max(0, todos.length - 1)));
  }, [todos.length]);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000);
  };

  useInput((input, key) => {
    if (mode !== "list") return;

    if (input === "q") {
      exit();
    } else if (input === "j" || key.downArrow) {
      setSelectedIndex((i) => Math.min(i + 1, todos.length - 1));
    } else if (input === "k" || key.upArrow) {
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (key.return) {
      const todo = todos[selectedIndex];
      if (todo && todo.status === "todo") {
        markDone(dataPath, todo.id);
        reload();
        showMessage(`完了: ${todo.title}`);
      }
    } else if (input === "a") {
      setMode("add");
    } else if (input === "e") {
      if (todos[selectedIndex]) setMode("edit");
    } else if (input === "d") {
      const todo = todos[selectedIndex];
      if (todo) {
        deleteTodo(dataPath, todo.id);
        reload();
        showMessage(`削除: ${todo.title}`);
      }
    } else if (input === "f") {
      // cycle status filter
      const cycle: StatusFilter[] = ["all", "todo", "done"];
      setStatusFilter((s) => cycle[(cycle.indexOf(s) + 1) % cycle.length]!);
    } else if (input === "F") {
      // cycle priority filter
      const cycle: PriorityFilter[] = ["all", "high", "medium", "low"];
      setPriorityFilter((p) => cycle[(cycle.indexOf(p) + 1) % cycle.length]!);
    }
  });

  const handleAddSubmit = (title: string, priority: Priority) => {
    addTodo(dataPath, { title, priority });
    reload();
    setMode("list");
    showMessage(`追加: ${title}`);
  };

  const handleEditSubmit = (title: string, priority: Priority) => {
    const todo = todos[selectedIndex];
    if (todo) {
      editTodo(dataPath, todo.id, { title, priority });
      reload();
      showMessage(`更新: ${title}`);
    }
    setMode("list");
  };

  return (
    <Box flexDirection="column">
      <Box paddingX={1}>
        <Text bold color="cyan">── TODO Manager ──</Text>
        <Text dimColor>  ({todos.length}件)</Text>
      </Box>

      <FilterBar statusFilter={statusFilter} priorityFilter={priorityFilter} />

      <TodoList todos={todos} selectedIndex={selectedIndex} />

      {message && (
        <Box paddingX={1}>
          <Text color="green">{message}</Text>
        </Box>
      )}

      {mode === "add" && (
        <AddForm onSubmit={handleAddSubmit} onCancel={() => setMode("list")} />
      )}

      {mode === "edit" && todos[selectedIndex] && (
        <EditForm
          todo={todos[selectedIndex]!}
          onSubmit={handleEditSubmit}
          onCancel={() => setMode("list")}
        />
      )}

      <StatusBar mode={mode} />
    </Box>
  );
}

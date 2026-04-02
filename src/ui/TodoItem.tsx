import React from "react";
import { Box, Text } from "ink";
import type { Todo } from "../types.js";

const PRIORITY_COLOR = {
  high: "red",
  medium: "yellow",
  low: "green",
} as const;

interface Props {
  todo: Todo;
  isSelected: boolean;
}

export default function TodoItem({ todo, isSelected }: Props) {
  const now = new Date();
  const overdue = todo.status === "todo" && todo.dueDate !== null && new Date(todo.dueDate) < now;

  return (
    <Box>
      <Text inverse={isSelected} color={isSelected ? "cyan" : undefined}>
        {" "}
        <Text dimColor>{todo.id.toString().padStart(3)}</Text>
        {" "}
        <Text color={todo.status === "done" ? "gray" : undefined}>
          {todo.status === "done" ? "[x]" : "[ ]"}
        </Text>
        {" "}
        <Text
          dimColor={todo.status === "done"}
          strikethrough={todo.status === "done"}
        >
          {todo.title}
        </Text>
        {" "}
        <Text color={PRIORITY_COLOR[todo.priority]}>[{todo.priority.toUpperCase()}]</Text>
        {todo.tags.length > 0 && (
          <Text dimColor> #{todo.tags.join(" #")}</Text>
        )}
        {todo.dueDate && (
          <Text color={overdue ? "red" : "gray"}>
            {" "}due:{new Date(todo.dueDate).toLocaleDateString("ja-JP")}
            {overdue ? "(期限超過)" : ""}
          </Text>
        )}
      </Text>
    </Box>
  );
}

import React from "react";
import { Box, Text } from "ink";
import TodoItem from "./TodoItem.js";
import type { Todo } from "../types.js";

interface Props {
  todos: Todo[];
  selectedIndex: number;
}

export default function TodoList({ todos, selectedIndex }: Props) {
  if (todos.length === 0) {
    return (
      <Box paddingX={2} paddingY={1}>
        <Text dimColor>TODOがありません。 "a" キーで追加できます。</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      {todos.map((todo, i) => (
        <TodoItem key={todo.id} todo={todo} isSelected={i === selectedIndex} />
      ))}
    </Box>
  );
}

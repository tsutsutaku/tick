import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import type { Priority, Todo } from "../types.js";

interface Props {
  todo: Todo;
  onSubmit: (title: string, priority: Priority) => void;
  onCancel: () => void;
}

const PRIORITIES: Priority[] = ["high", "medium", "low"];
const PRIORITY_COLOR: Record<Priority, string> = { high: "red", medium: "yellow", low: "green" };

export default function EditForm({ todo, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(todo.title);
  const [priorityIndex, setPriorityIndex] = useState(PRIORITIES.indexOf(todo.priority));
  const [step, setStep] = useState<"title" | "priority">("title");

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
      return;
    }
    if (step === "title") {
      if (key.return && title.trim()) {
        setStep("priority");
      }
    } else {
      if (key.leftArrow || input === "h") {
        setPriorityIndex((i) => Math.max(0, i - 1));
      } else if (key.rightArrow || input === "l") {
        setPriorityIndex((i) => Math.min(PRIORITIES.length - 1, i + 1));
      } else if (key.return) {
        onSubmit(title.trim(), PRIORITIES[priorityIndex]!);
      }
    }
  });

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="yellow" paddingX={1}>
      <Text bold color="yellow">── TODOを編集 (id: {todo.id}) ──</Text>
      <Box>
        <Text dimColor>タイトル: </Text>
        {step === "title" ? (
          <TextInput value={title} onChange={setTitle} onSubmit={() => title.trim() && setStep("priority")} />
        ) : (
          <Text>{title}</Text>
        )}
      </Box>
      {step === "priority" && (
        <Box>
          <Text dimColor>優先度: </Text>
          {PRIORITIES.map((p, i) => (
            <Text key={p} color={i === priorityIndex ? PRIORITY_COLOR[p] : "gray"} bold={i === priorityIndex}>
              {i === priorityIndex ? `[${p}]` : ` ${p} `}
            </Text>
          ))}
          <Text dimColor>  ←→で選択、Enterで確定</Text>
        </Box>
      )}
    </Box>
  );
}

import React from "react";
import { Box, Text } from "ink";

type Mode = "list" | "add" | "edit";

interface Props {
  mode: Mode;
}

const HINTS: Record<Mode, string> = {
  list: "j/k:移動  Enter:完了  a:追加  e:編集  d:削除  f:フィルター  q:終了",
  add: "Enter:確定  Esc:キャンセル",
  edit: "Enter:確定  Esc:キャンセル",
};

export default function StatusBar({ mode }: Props) {
  return (
    <Box borderStyle="single" borderColor="gray" paddingX={1}>
      <Text dimColor>{HINTS[mode]}</Text>
    </Box>
  );
}

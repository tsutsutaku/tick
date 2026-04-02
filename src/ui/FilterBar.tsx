import React from "react";
import { Box, Text } from "ink";
import type { Status, Priority } from "../types.js";

interface Props {
  statusFilter: Status | "all";
  priorityFilter: Priority | "all";
}

export default function FilterBar({ statusFilter, priorityFilter }: Props) {
  return (
    <Box borderStyle="single" borderColor="gray" paddingX={1}>
      <Text dimColor>フィルター: </Text>
      <Text color={statusFilter !== "all" ? "cyan" : "gray"}>
        状態:{statusFilter}
      </Text>
      <Text dimColor>  </Text>
      <Text color={priorityFilter !== "all" ? "cyan" : "gray"}>
        優先度:{priorityFilter}
      </Text>
    </Box>
  );
}

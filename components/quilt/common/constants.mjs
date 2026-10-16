const BASE_URL = "https://api.heyquilt.com";
const MCP_PROTOCOL_VERSION = "2025-06-18";

const WEBHOOK_EVENTS = [
  {
    label: "Mentioned in chat (@name)",
    value: "chat.mention",
  },
  {
    label: "Direct message",
    value: "chat.dm",
  },
  {
    label: "Task assigned",
    value: "task.assigned",
  },
];

const TASK_COLUMNS = [
  {
    label: "To do",
    value: "todo",
  },
  {
    label: "In progress",
    value: "doing",
  },
  {
    label: "QA",
    value: "qa",
  },
  {
    label: "Done",
    value: "done",
  },
];

// How old a webhook's timestamp may be before the POST is refused as a replay.
const WEBHOOK_TOLERANCE_MS = 5 * 60 * 1000;

export default {
  BASE_URL,
  MCP_PROTOCOL_VERSION,
  WEBHOOK_EVENTS,
  TASK_COLUMNS,
  WEBHOOK_TOLERANCE_MS,
};

const BASE_URL = "https://api.donethat.ai";

const AGGREGATION_LEVELS = [
  {
    label: "Day",
    value: "day",
  },
  {
    label: "Week",
    value: "week",
  },
  {
    label: "Task",
    value: "task",
  },
  {
    label: "Activity (per tracked minute)",
    value: "activity",
  },
];

const SUMMARY_LEVELS = [
  "day",
  "week",
  "month",
  "quarter",
  "year",
];

const SUMMARY_FORMATS = [
  {
    label: "Plain text",
    value: "text",
  },
  {
    label: "HTML",
    value: "html",
  },
  {
    label: "Slack Block Kit blocks",
    value: "slack",
  },
  {
    label: "Discord embed",
    value: "discord",
  },
];

const SORT_ORDERS = [
  {
    label: "Newest first",
    value: "desc",
  },
  {
    label: "Oldest first",
    value: "asc",
  },
];

const PROJECT_SORT_KEYS = [
  {
    label: "Created at (newest first)",
    value: "createdAt",
  },
  {
    label: "Updated at (newest first)",
    value: "updatedAt",
  },
  {
    label: "Last used (newest first)",
    value: "usedAt",
  },
];

const SEARCH_SOURCES = [
  {
    label: "Tasks",
    value: "tasks",
  },
  {
    label: "Activity",
    value: "activity",
  },
];

const PROJECT_COLORS = [
  "#FFB623",
  "#4BC0C0",
  "#6C63FF",
  "#FF4590",
  "#32D74B",
  "#FFD166",
  "#845EC2",
  "#00C2FF",
  "#FF6B6B",
  "#00B8A9",
  "#FF9F1C",
  "#F9F871",
  "#EF5DA8",
  "#4ECDC4",
  "#00BBF9",
  "#FF9671",
  "#FCBAD3",
  "#A6E3E9",
  "#FFCB77",
  "#D65DB1",
];

export default {
  BASE_URL,
  AGGREGATION_LEVELS,
  SUMMARY_LEVELS,
  SUMMARY_FORMATS,
  SORT_ORDERS,
  PROJECT_SORT_KEYS,
  SEARCH_SOURCES,
  PROJECT_COLORS,
};

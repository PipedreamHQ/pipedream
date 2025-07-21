export const PAGE_SIZE = 100;
export const DB_LAST_DATE_CHECK = "lastDateCheck";

export const TICKET_STATUS = {
  2: "Open",
  3: "Pending",
  4: "Resolved",
  5: "Closed",
};

export const TICKET_PRIORITY = {
  1: "Low",
  2: "Medium", 
  3: "High",
  4: "Urgent",
};

export const STATUS_OPTIONS = Object.entries(TICKET_STATUS).map(([
  value,
  label,
]) => ({
  label,
  value: parseInt(value),
}));

export const PRIORITY_OPTIONS = Object.entries(TICKET_PRIORITY).map(([
  value,
  label,
]) => ({
  label,
  value: parseInt(value),
}));

export const TICKET_SORT_OPTIONS = [
  "created_at",
  "due_by",
  "updated_at",
  "status",
];

export const ORDER_TYPE_OPTIONS = [
  {
    label: "Ascending",
    value: "asc",
  },
  {
    label: "Descending", 
    value: "desc",
  },
];
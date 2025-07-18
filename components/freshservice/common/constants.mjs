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

export const STATUS_OPTIONS = [
  {
    label: "Open",
    value: 2,
  },
  {
    label: "Pending", 
    value: 3,
  },
  {
    label: "Resolved",
    value: 4,
  },
  {
    label: "Closed",
    value: 5,
  },
];

export const PRIORITY_OPTIONS = [
  {
    label: "Low",
    value: 1,
  },
  {
    label: "Medium",
    value: 2,
  },
  {
    label: "High", 
    value: 3,
  },
  {
    label: "Urgent",
    value: 4,
  },
];

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
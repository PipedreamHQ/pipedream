export default {
  HTTP_PROTOCOL: "https://",
  BASE_PATH: "/api",
  VERSION_PATH: "/v2",
  PAGE_SIZE: 100,
  retriableStatusCodes: [
    408,
    429,
    500,
  ],
  DB_LAST_DATE_CHECK: "DB_LAST_DATE_CHECK",
  TICKET_STATUS: [
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
  ],
  TICKET_PRIORITY: [
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
  ],
};

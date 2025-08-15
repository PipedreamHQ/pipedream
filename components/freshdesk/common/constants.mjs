export default {
  PAGE_SIZE: 100,
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
  TICKET_SCOPE: [
    {
      label: "Global Access",
      value: 1,
    },
    {
      label: "Group Access",
      value: 2,
    },
    {
      label: "Restricted Access",
      value: 3,
    },
  ],
  AGENT_TYPE: [
    {
      label: "Support Agent",
      value: 1,
    },
    {
      label: "Field Agent",
      value: 2,
    },
    {
      label: "Collaborator",
      value: 3,
    },
  ],
  ARTICLE_STATUS: [
    {
      label: "Draft",
      value: 1,
    },
    {
      label: "Published",
      value: 2,
    },
  ],
};

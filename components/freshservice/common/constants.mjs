const TICKET_SOURCE_TYPES = [
  {
    label: "Email",
    value: 1,
  },
  {
    label: "Portal",
    value: 2,
  },
  {
    label: "Phone",
    value: 3,
  },
  {
    label: "Chat",
    value: 4,
  },
  {
    label: "Feedback widget",
    value: 5,
  },
  {
    label: "Yammer",
    value: 6,
  },
  {
    label: "AWS Cloudwatch",
    value: 7,
  },
  {
    label: "Pagerduty",
    value: 8,
  },
  {
    label: "Walkup",
    value: 9,
  },
  {
    label: "Slack",
    value: 10,
  },
];

const TICKET_STATUS = [
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

const TICKET_PRIORITIES = [
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

const SOLUTION_ARTICLE_TYPES = [
  {
    label: "Permanent",
    value: 1,
  },
  {
    label: "Workaround",
    value: 2,
  },
];

const SOLUTION_ARTICLE_STATUS = [
  {
    label: "Draft",
    value: 1,
  },
  {
    label: "Published",
    value: 2,
  },
];

export default {
  TICKET_SOURCE_TYPES,
  TICKET_STATUS,
  TICKET_PRIORITIES,
  SOLUTION_ARTICLE_TYPES,
  SOLUTION_ARTICLE_STATUS,
};

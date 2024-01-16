const ACTIVITY_MODE = [
  "today",
  "thisweek",
  "unread",
  "open",
  "favorites",
];

const OPPORTUNITY_TYPE = [
  "byStage",
  "byLevel",
  "byNeglected",
];

const BY_LEVEL_RANGE = [
  {
    value: 1,
    label: "Unaware",
  },
  {
    value: 2,
    label: "Contemplating",
  },
  {
    value: 3,
    label: "Planning",
  },
  {
    value: 4,
    label: "Action",
  },
];

const NEGLECTED_RANGE = [
  {
    value: 1,
    label: "Last 7 days",
  },
  {
    value: 2,
    label: "Last 30 days",
  },
  {
    value: 3,
    label: "Older than 30 days",
  },
];

export default {
  ACTIVITY_MODE,
  OPPORTUNITY_TYPE,
  BY_LEVEL_RANGE,
  NEGLECTED_RANGE,
};

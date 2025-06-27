const POSITIONS = [
  "top",
  "bottom",
];

const CARD_FILTERS = [
  "all",
  "closed",
  "none",
  "open",
  "visible",
];

const LIST_FILTERS = [
  "all",
  "closed",
  "none",
  "open",
];

const POWER_UPS = [
  "all",
  "calendar",
  "cardAging",
  "recap",
  "voting",
];

const PREFS_PERMISSION_LEVELS = [
  "org",
  "private",
  "public",
];

const PREFS_VOTING = [
  "disabled",
  "members",
  "observers",
  "org",
  "public",
];

const PREFS_COMMENTS = [
  "disabled",
  "members",
  "observers",
  "org",
  "public",
];

const PREFS_INVITATIONS = [
  "admins",
  "members",
];

const PREFS_BACKGROUNDS = [
  "blue",
  "orange",
  "green",
  "red",
  "purple",
  "pink",
  "lime",
  "sky",
  "grey",
];

const PREFS_CARD_AGING = [
  "pirate",
  "regular",
];

const LABEL_COLORS = [
  "yellow",
  "purple",
  "blue",
  "red",
  "green",
  "orange",
  "black",
  "sky",
  "pink",
  "lime",
  "null",
];

const NOTIFICATION_TIMES = [
  "5 minutes",
  "10 minutes",
  "15 minutes",
  "30 minutes",
  "1 hour",
  "2 hours",
  "3 hours",
  "6 hours",
  "12 hours",
  "1 day",
  "2 days",
  "3 days",
  "1 week",
];

const CARD_KEEP_FROM_SOURCE_PROPERTIES = [
  "all",
  "attachments",
  "checklists",
  "comments",
  "due",
  "labels",
  "members",
  "stickers",
];

const DUE_REMINDER_OPTIONS = [
  {
    label: "no reminder",
    value: "-1",
  },
  {
    label: "At delivery time",
    value: "0",
  },
  {
    label: "5 minutes before",
    value: "5",
  },
  {
    label: "10 minutes before",
    value: "10",
  },
  {
    label: "15 minutes before",
    value: "15",
  },
  {
    label: "1 hour before",
    value: "60",
  },
  {
    label: "2 hours before",
    value: "120",
  },
  {
    label: "1 day before",
    value: "1440",
  },
  {
    label: "2 days before",
    value: "2880",
  },
];

export default {
  POSITIONS,
  CARD_FILTERS,
  LIST_FILTERS,
  POWER_UPS,
  PREFS_PERMISSION_LEVELS,
  PREFS_VOTING,
  PREFS_COMMENTS,
  PREFS_INVITATIONS,
  PREFS_BACKGROUNDS,
  PREFS_CARD_AGING,
  LABEL_COLORS,
  NOTIFICATION_TIMES,
  CARD_KEEP_FROM_SOURCE_PROPERTIES,
  DUE_REMINDER_OPTIONS,
};

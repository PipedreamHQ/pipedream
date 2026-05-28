const API = {
  ACL: {
    NAME: "acl",
    METHOD: {
      DELETE: "delete",
      GET: "get",
      INSERT: "insert",
      LIST: "list",
      PATCH: "patch",
      UPDATE: "update",
      WATCH: "watch",
    },
  },
  CALENDARS: {
    NAME: "calendars",
    METHOD: {
      CLEAR: "clear",
      DELETE: "delete",
      GET: "get",
      INSERT: "insert",
      PATCH: "patch",
      UPDATE: "update",
    },
  },
  CALENDAR_LIST: {
    NAME: "calendarList",
    METHOD: {
      DELETE: "delete",
      GET: "get",
      INSERT: "insert",
      LIST: "list",
      PATCH: "patch",
      UPDATE: "update",
      WATCH: "watch",
    },
  },
  CHANNELS: {
    NAME: "channels",
    METHOD: {
      STOP: "stop",
    },
  },
  COLORS: {
    NAME: "colors",
    METHOD: {
      GET: "get",
    },
  },
  EVENTS: {
    NAME: "events",
    METHOD: {
      DELETE: "delete",
      GET: "get",
      IMPORT: "import",
      INSERT: "insert",
      INSTANCES: "instances",
      LIST: "list",
      MOVE: "move",
      PATCH: "patch",
      QUICK_ADD: "quickAdd",
      UPDATE: "update",
      WATCH: "watch",
    },
  },
  FREEBUSY: {
    NAME: "freebusy",
    METHOD: {
      QUERY: "query",
    },
  },
  SETTINGS: {
    NAME: "settings",
    METHOD: {
      GET: "get",
      LIST: "list",
      WATCH: "watch",
    },
  },
};

const REPEAT_FREQUENCIES = {
  DAILY: "day",
  WEEKLY: "week",
  MONTHLY: "month",
  YEARLY: "year",
};

const WEBHOOK_SUBSCRIPTION_EXPIRATION_TIME_MILLISECONDS = 24 * 60 * 60 * 1000;
const WEBHOOK_SUBSCRIPTION_RENEWAL_SECONDS =
  (WEBHOOK_SUBSCRIPTION_EXPIRATION_TIME_MILLISECONDS * 0.95) / 1000;

const DAYS_OF_WEEK = [
  {
    label: "Sunday",
    value: "SU",
  },
  {
    label: "Monday",
    value: "MO",
  },
  {
    label: "Tuesday",
    value: "TU",
  },
  {
    label: "Wednesday",
    value: "WE",
  },
  {
    label: "Thursday",
    value: "TH",
  },
  {
    label: "Friday",
    value: "FR",
  },
  {
    label: "Saturday",
    value: "SA",
  },
  {
    label: "Weekdays",
    value: "MO,TU,WE,TH,FR",
  },
];

export default {
  API,
  REPEAT_FREQUENCIES,
  WEBHOOK_SUBSCRIPTION_RENEWAL_SECONDS,
  DAYS_OF_WEEK,
};

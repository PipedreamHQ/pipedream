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

// https://developers.google.com/calendar/api/v3/reference/events#transparency
const TRANSPARENCY_OPTIONS = [
  {
    label: "Busy",
    value: "opaque",
  },
  {
    label: "Free",
    value: "transparent",
  },
];

// https://developers.google.com/workspace/calendar/api/v3/reference/events#resource
const SPLIT_CARRIED_EVENT_FIELDS = [
  "conferenceData",
  "reminders",
  "visibility",
  "guestsCanInviteOthers",
  "guestsCanModify",
  "guestsCanSeeOtherGuests",
];

const WRITABLE_ATTENDEE_FIELDS = [
  "email",
  "displayName",
  "optional",
  "resource",
  "responseStatus",
  "comment",
  "additionalGuests",
];

// https://developers.google.com/workspace/calendar/api/v3/reference/events/insert#parameters
const CONFERENCE_DATA_VERSION = 1;

const SEND_UPDATES_NONE = "none";

// https://developers.google.com/workspace/calendar/api/v3/reference/events/instances#parameters
const INSTANCES_MAX_RESULTS = 2500;

export default {
  API,
  REPEAT_FREQUENCIES,
  WEBHOOK_SUBSCRIPTION_RENEWAL_SECONDS,
  DAYS_OF_WEEK,
  TRANSPARENCY_OPTIONS,
  SPLIT_CARRIED_EVENT_FIELDS,
  WRITABLE_ATTENDEE_FIELDS,
  CONFERENCE_DATA_VERSION,
  SEND_UPDATES_NONE,
  INSTANCES_MAX_RESULTS,
};

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

export default {
  API,
  REPEAT_FREQUENCIES,
};

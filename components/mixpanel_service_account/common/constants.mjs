const QUERY_API_PATH = "/api/query";

const GENERAL_ANALYSIS_TYPE = "general";
const UNIQUE_ANALYSIS_TYPE = "unique";
const HOUR_UNIT = "hour";

const ANALYSIS_TYPES = [
  {
    label: "General - total number of times the event was fired",
    value: "general",
  },
  {
    label: "Unique - number of distinct users who fired the event",
    value: "unique",
  },
  {
    label: "Average - average number of times each user fired the event",
    value: "average",
  },
];

const TIME_UNITS = [
  "minute",
  "hour",
  "day",
  "week",
  "month",
];

// /funnels and /retention reject the minute and hour buckets TIME_UNITS allows.
const REPORT_TIME_UNITS = [
  "day",
  "week",
  "month",
];

const FUNNEL_LENGTH_UNITS = [
  "second",
  "minute",
  "hour",
  "day",
];

const RETENTION_TYPES = [
  {
    label: "Birth - first-time retention, measured from a user's first Born Event",
    value: "birth",
  },
  {
    label: "Compounded - recurring retention, measured from every qualifying event",
    value: "compounded",
  },
];

const BIRTH_RETENTION_TYPE = "birth";

// Defaults applied by the Mixpanel Query API when the parameter is omitted.
const DEFAULT_TOP_PROPERTIES_LIMIT = 10;
const DEFAULT_TOP_VALUES_LIMIT = 255;

// Documented ceilings. Exceeding them returns an opaque HTTP 500 rather than a
// validation message, so components check them before sending the request.
const MAX_FUNNEL_SEGMENTATION_LIMIT = 10000;
const MAX_FUNNEL_LENGTH_DAYS = 90;
const MAX_RETENTION_DAY_INTERVAL = 90;

const DAYS_PER_FUNNEL_LENGTH_UNIT = {
  second: 1 / 86400,
  minute: 1 / 1440,
  hour: 1 / 24,
  day: 1,
};

export default {
  QUERY_API_PATH,
  GENERAL_ANALYSIS_TYPE,
  UNIQUE_ANALYSIS_TYPE,
  HOUR_UNIT,
  ANALYSIS_TYPES,
  TIME_UNITS,
  REPORT_TIME_UNITS,
  FUNNEL_LENGTH_UNITS,
  RETENTION_TYPES,
  BIRTH_RETENTION_TYPE,
  DAYS_PER_FUNNEL_LENGTH_UNIT,
  DEFAULT_TOP_PROPERTIES_LIMIT,
  DEFAULT_TOP_VALUES_LIMIT,
  MAX_FUNNEL_SEGMENTATION_LIMIT,
  MAX_FUNNEL_LENGTH_DAYS,
  MAX_RETENTION_DAY_INTERVAL,
};

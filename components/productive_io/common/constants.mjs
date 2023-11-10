const BASE_URL = "https://api.productive.io";
const VERSION_PATH = "/api/v2";
const LAST_CREATED_AT = "lastCreatedAt";
const DEFAULT_MAX = 600;
const DEFAULT_LIMIT = 30;
const WEBHOOK_ID = "webhookId";

const BOOKING_METHOD_ID = {
  HOURS_PER_DAY: {
    label: "Hours Per Day",
    value: 1,
  },
  PERCENTAGE_PER_DAY: {
    label: "Percentage Per Day",
    value: 2,
  },
  TOTAL_TIME: {
    label: "Total Time",
    value: 3,
  },
};

const PERCENTAGE = {
  FIFTY_PERCENT: {
    label: "50%",
    value: 50,
  },
  HUNDRED_PERCENT: {
    label: "100%",
    value: 100,
  },
};

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_MAX,
  DEFAULT_LIMIT,
  LAST_CREATED_AT,
  WEBHOOK_ID,
  BOOKING_METHOD_ID,
  PERCENTAGE,
};

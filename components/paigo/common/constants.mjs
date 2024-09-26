const CONSUMPTION_UNITS = {
  "count": [
    "count-based",
  ],
  "time-based": [
    "second",
    "minute",
    "hour",
    "day",
  ],
  "data-based": [
    "byte",
    "kilobyte",
    "megabyte",
    "gigabyte",
  ],
};

const USAGE_ROUNDING = [
  "round",
  "floor",
  "ceiling",
];

const OFFERING_VISIBILITY = [
  "private",
  "public",
];

const OFFERING_TYPE = [
  "usage-based",
  "subscription",
];

const BILLING_CYCLE = [
  "monthly",
  "annualToDate",
];

const PAYMENT_CHANNELS = [
  "Stripe",
  "manual",
];

const ENVIRONMENTS = [
  "production",
  "sandbox",
];

export default {
  CONSUMPTION_UNITS,
  USAGE_ROUNDING,
  OFFERING_VISIBILITY,
  OFFERING_TYPE,
  BILLING_CYCLE,
  PAYMENT_CHANNELS,
  ENVIRONMENTS,
};

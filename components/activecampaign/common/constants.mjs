import currencies from "./currencies.mjs";

const VERSION_PATH = "/api/3";
const UPDATED_TIMESTAMP = "updatedTimestamp";
const DEFAULT_LIMIT = 100;
const ALL_SOURCES = [
  "public",
  "admin",
  "api",
  "system",
];

const CURRENCY_OPTIONS =
  currencies.map((currency) => ({
    label: currency,
    value: currency.toLowerCase(),
  }));

export default {
  VERSION_PATH,
  UPDATED_TIMESTAMP,
  DEFAULT_LIMIT,
  ALL_SOURCES,
  CURRENCY_OPTIONS,
};

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

const FIELD_VALUE_PROP_NAME = "fieldValue";
const ALLOW_CUSTOM_FIELD_TYPES = [
  "text",
  "textarea",
  // "date",
  // "datetime",
  // "radio",
  // "listbox",
  // "dropdown",
];

const CURRENCY_OPTIONS =
  currencies.map((currency) => ({
    label: currency,
    value: currency.toLowerCase(),
  }));

const API = {
  ACTIVECAMPAIGN: "activecampaign",
  TRACKCMP: "trackcmp",
};

export default {
  API,
  VERSION_PATH,
  UPDATED_TIMESTAMP,
  DEFAULT_LIMIT,
  ALL_SOURCES,
  CURRENCY_OPTIONS,
  ALLOW_CUSTOM_FIELD_TYPES,
  FIELD_VALUE_PROP_NAME,
};

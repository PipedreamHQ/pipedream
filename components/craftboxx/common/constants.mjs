const BASE_URL = "https://api.craftboxx.de";
const LAST_CREATED_AT = "lastCreatedAt";
const DEFAULT_MAX = 600;
const DEFAULT_LIMIT = 50;

const UNITS = [
  "BAG",
  "BAR",
  "BOTTLE",
  "BOX",
  "BUCKET",
  "BUNCH",
  "CANE",
  "CANISTER",
  "CARDBOARD",
  "CUBIC_METRE",
  "CENTIMETERS",
  "DAYS",
  "DOZEN",
  "FLAT_FEE",
  "GRAMS",
  "HOURS",
  "KILOGRAMS",
  "KILOMETER",
  "KILOWATT_PEAK",
  "LITRE",
  "METRES",
  "MILLILITRE",
  "MILLIMETRES",
  "PACK",
  "PAIR",
  "PANEL",
  "PARCEL",
  "PERCENT",
  "PIECE",
  "ROLL",
  "RUNNING_METER",
  "SAC",
  "SET",
  "SQUAREMETER",
  "TONS",
  "TRIMMING",
  "TUBE",
];

const CURRENCIES = [
  "EUR",
  "USD",
  "CHF",
];

const STATES = [
  "UNPLANNED",
  "SCHEDULED",
  "IN_PROGRESS",
  "PAUSED",
  "DELAYED",
  "DONE",
  "ARCHIVED",
];

const CUSTOMER_TYPES = [
  "MAILING",
  "BILLING",
  "DELIVERY",
  "MAILING",
  "BILLING",
  "DELIVERY",
];

export default {
  BASE_URL,
  DEFAULT_MAX,
  DEFAULT_LIMIT,
  LAST_CREATED_AT,
  UNITS,
  CURRENCIES,
  STATES,
  CUSTOMER_TYPES,
};

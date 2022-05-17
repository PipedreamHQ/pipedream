const ALLOWED_LINEITEMS_KEYS = [
  "Description",
  "Quantity",
  "UnitAmount",
  "TaxType",
];
const BASE_URL = "https://api.xero.com";
const VERSION_PATH = "/2.0";
const DEFAULT_API_PATH = "/api.xro";
const DB_LAST_DATE_CHECK = "DB_LAST_DATE_CHECK";

export default {
  ALLOWED_LINEITEMS_KEYS,
  BASE_URL,
  VERSION_PATH,
  DEFAULT_API_PATH,
  DB_LAST_DATE_CHECK,
};

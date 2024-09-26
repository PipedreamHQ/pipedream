const HOST = "wft-geo-db.p.rapidapi.com";
const BASE_URL = `https://${HOST}`;
const VERSION_PATH = "/v1";
const DEFAULT_LIMIT = 10;
const DEFAULT_MAX_RECORDS = 60;

const CITY_TYPES = [
  "CITY",
  "ADM2",
];

const LANG_CODES = [
  "en",
  "de",
  "es",
  "fr",
  "it",
  "pt",
  "ru",
  "zh",
];

export default {
  HOST,
  BASE_URL,
  VERSION_PATH,
  DEFAULT_LIMIT,
  DEFAULT_MAX_RECORDS,
  CITY_TYPES,
  LANG_CODES,
};

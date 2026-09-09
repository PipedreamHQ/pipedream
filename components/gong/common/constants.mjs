const SUMMARY_LABEL = "$summary";
const BASE_URL = "https://us-66463.api.gong.io";
const VERSION_PATH = "/v2";
const LAST_CREATED_AT = "lastCreatedAt";
const EMITTED_IDS = "emittedIds";
const DEFAULT_MAX = 600;

const DIRECTIONS = [
  "Inbound",
  "Outbound",
  "Conference",
  "Unknown",
];

const CALL_PROVIDER_CODES = [
  "zoom",
  "clearslide",
  "gotomeeting",
  "ringcentral",
  "outreach",
  "insidesales",
];

export default {
  SUMMARY_LABEL,
  BASE_URL,
  VERSION_PATH,
  DEFAULT_MAX,
  LAST_CREATED_AT,
  EMITTED_IDS,
  DIRECTIONS,
  CALL_PROVIDER_CODES,
};

const REGION_PLACEHOLDER = "{region}";
const BASE_URL = "https://{region}.langfuse.com";
const VERSION_PATH = "/api/public";

const INGESTION_TYPE = {
  TRACE_CREATE: "trace-create",
  SCORE_CREATE: "score-create",
  SPAN_CREATE: "span-create",
  SPAN_UPDATE: "span-update",
  GENERATION_CREATE: "generation-create",
  GENERATION_UPDATE: "generation-update",
  EVENT_CREATE: "event-create",
  SDK_LOG: "sdk-log",
  OBSERVATION_CREATE: "observation-create",
  OBSERVATION_UPDATE: "observation-update",
};

const LAST_DATE_AT = "lastDateAt";
const IS_FIRST_RUN = "isFirstRun";
const DEFAULT_LIMIT = 100;
const DEFAULT_MAX = 1000;

const OBJECT_TYPE = {
  TRACE: "TRACE",
  OBSERVATION: "OBSERVATION",
  SESSION: "SESSION",
  PROMPT: "PROMPT",
};

export default {
  REGION_PLACEHOLDER,
  BASE_URL,
  VERSION_PATH,
  INGESTION_TYPE,
  LAST_DATE_AT,
  IS_FIRST_RUN,
  DEFAULT_LIMIT,
  DEFAULT_MAX,
  OBJECT_TYPE,
};

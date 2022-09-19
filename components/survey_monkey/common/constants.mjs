const VERSION_PATH = "/v3";
const BASE_URL = "https://api.surveymonkey.com";
const EVENT_TYPES = [
  "response_completed",
  "response_updated",
  "response_disqualified",
  "response_created",
  "response_deleted",
  "response_overquota",
  "collector_updated",
  "collector_deleted",
];

const ADDITIONAL_EVENT_TYPES = [
  "collector_created",
  "survey_created",
  "survey_updated",
  "survey_deleted",
];

export default {
  VERSION_PATH,
  BASE_URL,
  EVENT_TYPES,
  ADDITIONAL_EVENT_TYPES,
};

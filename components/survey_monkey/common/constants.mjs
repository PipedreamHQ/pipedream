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

// https://api.surveymonkey.com/v3/docs#api-endpoints-post-surveys-survey_id-collectors
const COLLECTOR_TYPES = [
  {
    label: "SMS invitation",
    value: "sms",
  },
  {
    label: "Web link",
    value: "weblink",
  },
  {
    label: "Email invitation",
    value: "email",
  },
  {
    label: "Popup invitation",
    value: "popup_invitation",
  },
  {
    label: "Embedded survey",
    value: "embedded_survey",
  },
  {
    label: "Popup survey",
    value: "popup_survey",
  },
];

const MESSAGE_TYPES = [
  "invite",
  "reminder",
  "thank_you",
  "sms",
];

const ANONYMOUS_TYPES = [
  "not_anonymous",
  "partially_anonymous",
  "fully_anonymous",
];

const EDIT_RESPONSE_TYPES = [
  "until_complete",
  "never",
  "always",
];

export default {
  VERSION_PATH,
  BASE_URL,
  EVENT_TYPES,
  ADDITIONAL_EVENT_TYPES,
  COLLECTOR_TYPES,
  MESSAGE_TYPES,
  ANONYMOUS_TYPES,
  EDIT_RESPONSE_TYPES,
};

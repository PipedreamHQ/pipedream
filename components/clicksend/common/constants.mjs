const BASE_URL = "https://rest.clicksend.com";
const VERSION_PATH = "/v3";
const WEBHOOK_ID = "webhookId";
const DEFAULT_LIMIT = 50;

const DISABLED = 0;
const ENABLED = 1;

const MSG_SEARCH_TYPE = {
  ANY_MSG: 0,
  STARTS_WITH: 1,
  CONTAINS: 2,
  DOES_NOT_CONTAIN: 3,
};

const ACTION = {
  AUTO_REPLY: "AUTO_REPLY",
  EMAIL_USER: "EMAIL_USER",
  EMAIL_FIXED: "EMAIL_FIXED",
  URL: "URL",
  SMS: "SMS",
  POLL: "POLL",
  GROUP_SMS: "GROUP_SMS",
  MOVE_CONTACT: "MOVE_CONTACT",
  CREATE_CONTACT: "CREATE_CONTACT",
  CREATE_CONTACT_PLUS_EMAIL: "CREATE_CONTACT_PLUS_EMAIL",
  CREATE_CONTACT_PLUS_NAME_EMAIL: "CREATE_CONTACT_PLUS_NAME_EMAIL",
  CREATE_CONTACT_PLUS_NAME: "CREATE_CONTACT_PLUS_NAME",
  SMPP: "SMPP",
  NONE: "NONE",
};

const WEBHOOK_TYPE = {
  POST: "post",
  GET: "get",
  JSON: "json",
};

const MATCH_TYPE = {
  ALL_REPORTS: 0,
};

const VOICE_TYPES = [
  "female",
  "male",
];

const LANGUAGE_OPTIONS = [
  {
    "label": "English, US",
    "value": "en-us",
  },
  {
    "label": "English, Australia",
    "value": "en-au",
  },
  {
    "label": "English, UK",
    "value": "en-gb",
  },
  {
    "label": "English, India",
    "value": "en-in",
  },
  {
    "label": "English, Wales",
    "value": "en-gb-wls",
  },
  {
    "label": "Celtic, Wales",
    "value": "cy-gb-wls",
  },
  {
    "label": "German, Germany",
    "value": "de-de",
  },
  {
    "label": "Spanish, Spain",
    "value": "es-es",
  },
  {
    "label": "Spanish, US",
    "value": "es-us",
  },
  {
    "label": "French, Canada",
    "value": "fr-ca",
  },
  {
    "label": "French, France",
    "value": "fr-fr",
  },
  {
    "label": "Icelandic, Iceland",
    "value": "is-is",
  },
  {
    "label": "Italian, Italy",
    "value": "it-it",
  },
  {
    "label": "Danish, Denmark",
    "value": "da-dk",
  },
  {
    "label": "Dutch, Netherlands",
    "value": "nl-nl",
  },
  {
    "label": "Norwegian, Norway",
    "value": "nb-no",
  },
  {
    "label": "Polish, Poland",
    "value": "pl-pl",
  },
  {
    "label": "Portuguese, Portugal",
    "value": "pt-pt",
  },
  {
    "label": "Portuguese, Brazil",
    "value": "pt-br",
  },
  {
    "label": "Romanian, Romania",
    "value": "ro-ro",
  },
  {
    "label": "Russian, Russia",
    "value": "ru-ru",
  },
  {
    "label": "Swedish, Sweden",
    "value": "sv-se",
  },
  {
    "label": "Turkish, Turkey",
    "value": "tr-tr",
  },
];

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_LIMIT,
  WEBHOOK_ID,
  DISABLED,
  ENABLED,
  MSG_SEARCH_TYPE,
  ACTION,
  WEBHOOK_TYPE,
  MATCH_TYPE,
  VOICE_TYPES,
  LANGUAGE_OPTIONS,
};

const VERSION_PATH = "rest";
const BASE_URL = "https://api.linkedin.com/";

const VISIBILITIES = [
  {
    label: "Connections",
    value: "CONNECTIONS",
  },
  {
    label: "Public",
    value: "PUBLIC",
  },
  {
    label: "Logged in",
    value: "LOGGED_IN",
  },
];

const TYPES = [
  {
    label: "Text/URL",
    value: "NONE",
  },
  {
    label: "Article",
    value: "ARTICLE",
  },
];

export default {
  VERSION_PATH,
  BASE_URL,
  VISIBILITIES,
  TYPES,
};

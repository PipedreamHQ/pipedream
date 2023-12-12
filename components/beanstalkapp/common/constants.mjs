const DOMAIN_PLACEHOLDER = "<domain>";
const BASE_URL = `https://${DOMAIN_PLACEHOLDER}.beanstalkapp.com`;
const VERSION_PATH = "/api";
const DEFAULT_LIMIT = 50;
const DEFAULT_MAX = 600;

const REPO_TYPE = {
  GIT: "git",
};

const INTEGRATION_TYPE = {
  WEBHOOKS_INTEGRATION: "WebHooksIntegration",
};

const COLOR_LABELS = [
  "label-white",
  "label-pink",
  "label-red",
  "label-red-orange",
  "label-orange",
  "label-yellow",
  "label-yellow-green",
  "label-aqua-green",
  "label-green",
  "label-green-blue",
  "label-sky-blue",
  "label-light-blue",
  "label-blue",
  "label-orchid",
  "label-violet",
  "label-brown",
  "label-black",
  "label-grey",
];
const INTEGRATION_ID = "integrationId";

export default {
  DOMAIN_PLACEHOLDER,
  BASE_URL,
  VERSION_PATH,
  DEFAULT_MAX,
  DEFAULT_LIMIT,
  COLOR_LABELS,
  REPO_TYPE,
  INTEGRATION_ID,
  INTEGRATION_TYPE,
};

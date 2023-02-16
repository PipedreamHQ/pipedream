const VERSION_PATH = "rest";
const BASE_URL = "https://api.linkedin.com/";
const VERSION_HEADER = "202206";

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

const TIME_GRANULARITY_OPTIONS = [
  "ALL",
  "DAILY",
  "MONTHLY",
  "YEARLY",
];

const PIVOT_OPTIONS = [
  "COMPANY",
  "ACCOUNT",
  "SHARE",
  "CAMPAIGN",
  "CREATIVE",
  "CAMPAIGN_GROUP",
  "CONVERSION",
  "CONVERSATION_NODE",
  "CONVERSATION_NODE_OPTION_INDEX",
  "SERVING_LOCATION",
  "CARD_INDEX",
  "MEMBER_COMPANY_SIZE",
  "MEMBER_INDUSTRY",
  "MEMBER_SENIORITY",
  "MEMBER_JOB_TITLE",
  "MEMBER_JOB_FUNCTION",
  "MEMBER_COUNTRY_V2",
  "MEMBER_REGION_V2",
  "MEMBER_COMPANY",
];

const ORGANIZATION_ROLES = [
  "ADMINISTRATOR",
  "DIRECT_SPONSORED_CONTENT_POSTER",
  "RECRUITING_POSTER",
  "LEAD_CAPTURE_ADMINISTRATOR",
  "LEAD_GEN_FORMS_MANAGER",
  "ANALYST",
  "CURATOR",
  "CONTENT_ADMINISTRATOR",
];

const ROLE_STATES = [
  "APPROVED",
  "REJECTED",
  "REQUESTED",
  "REVOKED",
];

export default {
  VERSION_PATH,
  BASE_URL,
  VERSION_HEADER,
  VISIBILITIES,
  TYPES,
  TIME_GRANULARITY_OPTIONS,
  PIVOT_OPTIONS,
  ORGANIZATION_ROLES,
  ROLE_STATES,
};

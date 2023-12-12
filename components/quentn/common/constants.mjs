const SYSTEM_ID_PLACEHOLDER = "<system_id>";
const SERVER_ID_PLACEHOLDER = "<server_id>";
const BASE_URL = `https://${SYSTEM_ID_PLACEHOLDER}.${SERVER_ID_PLACEHOLDER}.quentn.com`;
const VERSION_PATH = "/public/api/V1";
const DEFAULT_LIMIT = 100;

const FIELDS = [
  "mail",
  "title",
  "first_name",
  "family_name",
  "company",
  "job_title",
  "phone_type",
  "phone",
  "skype",
  "fb",
  "twitter",
  "ba_street",
  "ba_city",
  "ba_postal_code",
  "ba_state",
  "ba_country",
  "date_of_birth",
  "terms",
];

const TITLE_OPTIONS = [
  {
    label: "Mr.",
    value: "m",
  },
  {
    label: "Mrs.",
    value: "f",
  },
];

const PHONE_TYPE_OPTIONS = [
  {
    label: "Work",
    value: "work",
  },
  {
    label: "Home",
    value: "home",
  },
  {
    label: "Mobile",
    value: "mobile",
  },
  {
    label: "Other",
    value: "other",
  },
];

export default {
  SYSTEM_ID_PLACEHOLDER,
  SERVER_ID_PLACEHOLDER,
  BASE_URL,
  VERSION_PATH,
  DEFAULT_LIMIT,
  FIELDS,
  TITLE_OPTIONS,
  PHONE_TYPE_OPTIONS,
};

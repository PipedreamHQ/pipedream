const COMPANY_DOMAIN_PLACEHOLDER = "{companydomain}";
const BASE_URL = `https://${COMPANY_DOMAIN_PLACEHOLDER}.pipedrive.com`;
const VERSION_PATH = "/v1";

const STATUS_OPTIONS = [
  "open",
  "won",
  "lost",
  "deleted",
];

const FIELD_OPTIONS = [
  "custom_fields",
  "email",
  "notes",
  "phone",
  "name",
];

const VISIBLE_TO_OPTIONS = [
  "1",
  "3",
];
const INCLUDE_FIELDS_OPTIONS = [
  "person.picture",
];

export default {
  COMPANY_DOMAIN_PLACEHOLDER,
  BASE_URL,
  VERSION_PATH,
  STATUS_OPTIONS,
  FIELD_OPTIONS,
  VISIBLE_TO_OPTIONS,
  INCLUDE_FIELDS_OPTIONS,
};

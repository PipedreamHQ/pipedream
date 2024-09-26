const API_PLACEHOLDER = "api";
const BASE_URL = `https://${API_PLACEHOLDER}.newzenler.com`;
const VERSION_PATH = "/api/v1";
const DEFAULT_LIMIT = 50;
const MAX_RESOURCES = 500;

const ROLES_OPTIONS = [
  {
    label: "Site Admin",
    value: "2",
  },
  {
    label: "Course Instructor",
    value: "3",
  },
  {
    label: "Student",
    value: "4",
  },
  {
    label: "Affiliate",
    value: "7",
  },
  {
    label: "Lead",
    value: "8",
  },
  {
    label: "Assistant",
    value: "11",
  },
  {
    label: "Support",
    value: "12",
  },
];

export default {
  API_PLACEHOLDER,
  BASE_URL,
  VERSION_PATH,
  DEFAULT_LIMIT,
  MAX_RESOURCES,
  ROLES_OPTIONS,
};

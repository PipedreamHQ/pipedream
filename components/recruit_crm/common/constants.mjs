const BASE_URL = "https://api.recruitcrm.io";
const VERSION_PATH = "/v1";
const SUBSCRIPTION_ID = "subscriptionId";

const PAGINATION = {
  LIMIT: 100,
  SORT_BY: {
    CREATED_ON: "createdon",
    UPDATED_ON: "updatedon",
  },
  SORT_ORDER: {
    ASC: "asc",
    DESC: "desc",
  },
};

const REMINDER_OPTIONS = [
  {
    label: "No Reminder",
    value: "-1",
  },
  {
    label: "0 Minutes Before",
    value: "0",
  },
  {
    label: "15 Minutes Before",
    value: "15",
  },
  {
    label: "30 Minutes Before",
    value: "30",
  },
  {
    label: "1 Hour Before",
    value: "60",
  },
  {
    label: "2 Hours Before",
    value: "120",
  },
  {
    label: "1 Day Before",
    value: "1440",
  },
];

const RELATED_TO_TYPES = [
  "candidate",
  "contact",
  "company",
  "job",
  "deal",
];

const GENDER = {
  MALE: {
    label: "Male",
    value: 1,
  },
  FEMALE: {
    label: "Female",
    value: 2,
  },
};

export default {
  BASE_URL,
  VERSION_PATH,
  SUBSCRIPTION_ID,
  PAGINATION,
  REMINDER_OPTIONS,
  RELATED_TO_TYPES,
  GENDER,
};

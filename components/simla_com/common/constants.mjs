const SUBDOMAIN_PLACEHOLDER = "{subdomain}";
const VERSION_PLACEHOLDER = "{version}";
const BASE_URL = `https://${SUBDOMAIN_PLACEHOLDER}.simla.com/api/${VERSION_PLACEHOLDER}`;
const IS_FIRST_RUN = "isFirstRun";
const LAST_DATE_AT = "lastDateAt";
const DEFAULT_LIMIT = 20;
const DEFAULT_MAX = 200;

const CUSTOMER_TYPE = {
  CUSTOMER: {
    label: "Customer",
    value: "customer",
  },
  CORPORATE: {
    label: "Corporate Customer",
    value: "customer_corporate",
  },
};

export default {
  SUBDOMAIN_PLACEHOLDER,
  VERSION_PLACEHOLDER,
  BASE_URL,
  IS_FIRST_RUN,
  CUSTOMER_TYPE,
  LAST_DATE_AT,
  DEFAULT_LIMIT,
  DEFAULT_MAX,
};

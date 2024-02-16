const BASE_URL = "https://api.productive.io";
const VERSION_PATH = "/api/v2";
const LAST_CREATED_AT = "lastCreatedAt";
const DEFAULT_MAX = 600;
const DEFAULT_LIMIT = 30;
const WEBHOOK_ID = "webhookId";
const WEBHOOK_TOKEN = "webhookToken";

const BOOKING_METHOD_ID = {
  HOURS_PER_DAY: {
    label: "Hours Per Day",
    value: 1,
  },
  PERCENTAGE_PER_DAY: {
    label: "Percentage Per Day",
    value: 2,
  },
  TOTAL_TIME: {
    label: "Total Time",
    value: 3,
  },
};

const PERCENTAGE = {
  FIFTY_PERCENT: {
    label: "50%",
    value: 50,
  },
  HUNDRED_PERCENT: {
    label: "100%",
    value: 100,
  },
};

const CONTACTABLE_TYPE_OPTION = {
  CONTACT: {
    label: "Contact Person",
    value: "contact",
  },
  USER: {
    label: "User Person",
    value: "user",
  },
  COMPANY: {
    label: "Company Client",
    value: "company",
  },
  INVOICE: {
    label: "(Bill From/Bill To) Invoice",
    value: "invoice",
  },
  SUBSIDIARY: {
    label: "Subsidiary",
    value: "subsidiary",
  },
  PURCHASE_ORDER: {
    label: "Purchase Order",
    value: "purchase_order",
  },
};

const CONTACT_TYPE_OPTION = {
  ADDRESS: {
    label: "Address",
    value: "address",
  },
  BILL_FROM: {
    label: "Bill From",
    value: "bill_from",
  },
  BILL_TO: {
    label: "Bill To",
    value: "bill_to",
  },
  EMAIL: {
    label: "Email",
    value: "email",
  },
  PHONE: {
    label: "Phone",
    value: "phone",
  },
  WEBSITE: {
    label: "Website",
    value: "website",
  },
};

const CONTACTABLE_TYPE = {
  contact: "contacts",
  user: "users",
  company: "companies",
  invoice: "invoices",
  subsidiary: "subsidiaries",
  purchase_order: "purchase_orders",
};

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_MAX,
  DEFAULT_LIMIT,
  LAST_CREATED_AT,
  WEBHOOK_ID,
  WEBHOOK_TOKEN,
  BOOKING_METHOD_ID,
  PERCENTAGE,
  CONTACTABLE_TYPE,
  CONTACTABLE_TYPE_OPTION,
  CONTACT_TYPE_OPTION,
};

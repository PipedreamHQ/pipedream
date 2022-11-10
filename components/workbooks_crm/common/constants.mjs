const BASE_URL = "https://secure.workbooks.com";

const MAX_RESOURCES = 300;
const DEFAULT_LIMIT = 100;

// All these IDs were found in:
// Configuration -> Automation -> Triggers
// then click on one of the triggers and then click on the `i` icon to
// show the ID of the trigger. All these IDs are harcoded
// in the system and there is no endpoint to get them.
const TRIGGER_ID = {
  NEW_PERSON: 1,
  NEW_ORGANISATION: 3,
  NEW_SALES_LEAD: 5,
  NEW_CASE: 7,
  NEW_TASK: 9,
  POSTED_INVOICE: 11,
  POSTED_CREDIT_NOTE: 13,
  POSTED_QUOTATION: 14,
  POSTED_ORDER: 16,
  POSTED_SUPPLIER_ORDER: 18,
  ACTIVE_CONTRACT: 20,
  INACTIVE_CONTRACT: 22,
  NEW_PRODUCT: 24,
  NEW_MARKETING_CAMPAGIN: 26,
  NEW_MEETING: 28,
  NEW_API_DATA: 30,
};

const WEBHOOK_ID = "webhookId";
const SECRET_KEY = "secretKey";

export default {
  BASE_URL,
  DEFAULT_LIMIT,
  MAX_RESOURCES,
  TRIGGER_ID,
  WEBHOOK_ID,
  SECRET_KEY,
};

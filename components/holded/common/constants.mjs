const BASE_URL = "https://api.holded.com";
const LAST_STARTING_TIMESTAMP = "lastStartingTimestamp";

const API_PATH = {
  INVOICING: {
    V1: "/api/invoicing/v1",
  },
  CRM: {
    V1: "/api/crm/v1",
  },
  PROJECTS: {
    V1: "/api/projects/v1",
  },
  TEAM: {
    V1: "/api/team/v1",
  },
  ACCOUNTING: {
    V1: "/api/accounting/v1",
  },
};

const DOC_TYPE = {
  INVOICE: "invoice",
  SALES_RECEIPT: "salesreceipt",
  CREDIT_NOTE: "creditnote",
  SALES_ORDER: "salesorder",
  PROFORM: "proform",
  WAYBILL: "waybill",
  ESTIMATE: "estimate",
  PURCHASE: "purchase",
  PURCHASE_ORDER: "purchaseorder",
  PURCHASE_REFUND: "purchaserefund",
};

const CONTACT_TYPE = {
  SUPPLIER: "supplier",
  DEBTOR: "debtor",
  CREDITOR: "creditor",
  CLIENT: "client",
  LEAD: "lead",
};

export default {
  BASE_URL,
  API_PATH,
  LAST_STARTING_TIMESTAMP,
  DOC_TYPE,
  CONTACT_TYPE,
};

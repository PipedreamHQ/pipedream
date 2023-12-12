const BASE_URL = "https://api.megaventory.com";
const VERSION_PATH = "/v2017a";
const LAST_CREATED_AT = "lastCreatedAt";
const DEFAULT_MAX = 600;

const MV_RECORD_ACTION = {
  INSERT: "Insert",
  UPDATE: "Update",
  INSERT_OR_UPDATE: "InsertOrUpdate",
  INSERT_OR_UPDATE_NON_EMPTY_FIELDS: "InsertOrUpdateNonEmptyFields",
  SAVE: "Save",
  SAVE_NON_EMPTY_FIELDS: "SaveNonEmptyFields",
  VERIFY: "Verify",
  REVERT_TO_PENDING: "RevertToPending",
  CLOSE: "Close",
  RE_OPEN: "ReOpen",
  CANCEL: "Cancel",
  DELETE: "Delete",
  CLONE: "Clone",
  RECEIVE_ITEMS: "ReceiveItems",
  SHIP_ITEMS: "ShipItems",
  INVOICE_ITEMS: "InvoiceItems",
};

const ORDER_STATUS = {
  PENDING: {
    label: "Pending",
    value: "Pending",
  },
  VERIFIED: {
    label: "Verified",
    value: "Verified",
  },
  CLOSED: {
    label: "Closed",
    value: "Closed",
  },
  CANCELLED: {
    label: "Cancelled",
    value: "Cancelled",
  },
  REOPENED: {
    label: "ReOpened",
    value: "ReOpened",
  },
};

const PURCHASE_ORDER_STATUS = {
  ...ORDER_STATUS,
  RECEIVED: {
    label: "Received",
    value: "Received",
  },
};

const SALES_ORDER_STATUS = {
  ...ORDER_STATUS,
  SHIPPED: {
    label: "Shipped",
    value: "Shipped",
  },
};

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_MAX,
  LAST_CREATED_AT,
  MV_RECORD_ACTION,
  ORDER_STATUS,
  PURCHASE_ORDER_STATUS,
  SALES_ORDER_STATUS,
};

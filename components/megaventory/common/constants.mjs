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
  VALID_STATUS: {
    label: "Valid Status",
    value: "ValidStatus",
  },
  PENDING: {
    label: "Pending",
    value: "Pending",
  },
  VERIFIED: {
    label: "Verified",
    value: "Verified",
  },
  PARTIALLY_INVOICED: {
    label: "Partially Invoiced",
    value: "PartiallyInvoiced",
  },
  FULLY_INVOICED: {
    label: "Fully Invoiced",
    value: "FullyInvoiced",
  },
  CLOSED: {
    label: "Closed",
    value: "Closed",
  },
  CANCELLED: {
    label: "Cancelled",
    value: "Cancelled",
  },
};

const PURCHASE_ORDER_STATUS = {
  ...ORDER_STATUS,
  PARTIALLY_RECEIVED: {
    label: "Partially Received",
    value: "PartiallyReceived",
  },
  PARTIALLY_RECEIVED_AND_PARTIALLY_INVOICED: {
    label: "Partially Received and Partially Invoiced",
    value: "PartiallyReceivedAndPartiallyInvoiced",
  },
  FULLY_RECEIVED: {
    label: "Fully Received",
    value: "FullyReceived",
  },
};

const SALES_ORDER_STATUS = {
  ...ORDER_STATUS,
  PARTIALLY_SHIPPED: {
    label: "Partially Shipped",
    value: "PartiallyShipped",
  },
  PARTIALLY_SHIPPED_AND_PARTIALLY_INVOICED: {
    label: "Partially Shipped and Partially Invoiced",
    value: "PartiallyShippedAndPartiallyInvoiced",
  },
  FULLY_SHIPPED: {
    label: "Fully Shipped",
    value: "FullyShipped",
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

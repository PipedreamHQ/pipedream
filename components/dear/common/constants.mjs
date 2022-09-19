const BASE_URL = "https://inventory.dearsystems.com";
const VERSION_PATH = "/ExternalApi/v2";
const API_AUTH_ACCOUNT_ID_HEADER = "api-auth-accountid";
const API_AUTH_APPLICATION_KEY_HEADER = "api-auth-applicationkey";
const X_AMZN_TRACE_ID_HEADER = "x-amzn-trace-id";
const WEBHOOK_ID = "webhookId";
const VERIFICATION_TOKEN = "verificationToken";
const VERIFICATION_TOKEN_HEADER = "verification-token";

/**
 * All available values for Webhook Type.
 * https://dearinventory.docs.apiary.io/#reference/webhooks/webhooks
 */
const WEBHOOK_TYPE = {
  SALE_QUOTE_AUTHORISED: "Sale/QuoteAuthorised",
  SALE_ORDER_AUTHORISED: "Sale/OrderAuthorised",
  SALE_VOIDED: "Sale/Voided",
  SALE_BACKORDERED: "Sale/Backordered",
  SALE_SHIPMENT_AUTHORISED: "Sale/ShipmentAuthorised",
  SALE_INVOICEA_UTHORISED: "Sale/InvoiceAuthorised",
  SALE_PICK_AUTHORISED: "Sale/PickAuthorised",
  SALE_PACK_AUTHORISED: "Sale/PackAuthorised",
  SALE_CREDIT_NOTE_AUTHORISED: "Sale/CreditNoteAuthorised",
  SALE_UNDO: "Sale/Undo",
  SALE_PARTIAL_PAYMENT_RECEIVED: "Sale/PartialPaymentReceived",
  SALE_FULL_PAYMENT_RECEIVED: "Sale/FullPaymentReceived",
  SALE_SHIPMENT_TRACKING_NUMBER_CHANGED: "Sale/ShipmentTrackingNumberChanged",
  PURCHASE_ORDER_AUTHORISED: "Purchase/OrderAuthorised",
  PURCHASE_INVOICE_AUTHORISED: "Purchase/InvoiceAuthorised",
  PURCHASE_STOCK_RECEIVED_AUTHORISED: "Purchase/StockReceivedAuthorised",
  PURCHASE_CREDIT_NOTE_AUTHORISED: "Purchase/CreditNoteAuthorised",
  CUSTOMER_UPDATED: "Customer/Updated",
  SUPPLIER_UPDATED: "Supplier/Updated",
  STOCK_AVAILABLE_STOCK_LEVEL_CHANGE: "Stock/AvailableStockLevelChanged",
};

const PAGE_LIMIT = 100;

export default {
  BASE_URL,
  VERSION_PATH,
  API_AUTH_ACCOUNT_ID_HEADER,
  API_AUTH_APPLICATION_KEY_HEADER,
  X_AMZN_TRACE_ID_HEADER,
  VERIFICATION_TOKEN,
  VERIFICATION_TOKEN_HEADER,
  WEBHOOK_TYPE,
  WEBHOOK_ID,
  PAGE_LIMIT,
};

const ALLOWED_LINEITEMS_KEYS = [
  "Description",
  "Quantity",
  "UnitAmount",
  "TaxType",
];

const BASE_URL = "https://api.xero.com/api.xro/2.0";
const INVOICE_API = `${BASE_URL}/invoices`;
const CONTACT_API = `${BASE_URL}/contacts`;
const SUBSCRIPTION_API = "https://api.xero.com/appstore/2.0/Subscriptions";

export default {
  ALLOWED_LINEITEMS_KEYS,
  INVOICE_API,
  CONTACT_API,
  SUBSCRIPTION_API,
};

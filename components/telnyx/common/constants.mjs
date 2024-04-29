const phoneNumberStatus = {
  "PURCHASE PENDING": "purchase_pending",
  "PURCHASE FAILED": "purchase_failed",
  "PORT PENDING": "port_pending",
  "ACTIVE": "active",
  "DELETED": "deleted",
  "PORT FAILED": "port_failed",
  "EMERGENCY ONLY": "emergency_only",
  "PORTED OUT": "ported_out",
  "PORT OUT PENDING": "port_out_pending",
};

const paymentMethods = {
  "PAY PER MINUTE": "pay-per-minute",
  "CHANNEL": "channel",
};

const sortPhoneNumbers = {
  "PURCHASED AT": "purchased_at",
  "PHONE NUMBER": "phone_number",
  "CONNECTION NAME": "connection_name",
  "USAGE PAYMENT METHOD": "usage_payment_method",
};
export default {
  phoneNumberStatus,
  paymentMethods,
  sortPhoneNumbers,
};

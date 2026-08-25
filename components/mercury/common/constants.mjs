export const BASE_URL = "https://api.mercury.com/api/v1";
export const SANDBOX_BASE_URL = "https://api-sandbox.mercury.com/api/v1";
export const DEFAULT_LIMIT = 1000;
export const MIN_LIMIT = 1;
export const MAX_LIMIT = 1000;
export const PAYMENT_METHODS = [
  "ach",
  "check",
  "domesticWire",
];
export const ELECTRONIC_ACCOUNT_TYPES = [
  "businessChecking",
  "businessSavings",
  "personalChecking",
  "personalSavings",
];
export const TRANSACTION_STATUSES = [
  "pending",
  "sent",
  "cancelled",
  "failed",
  "reversed",
  "blocked",
];
export const ORDER = [
  "asc",
  "desc",
];
export const SEND_MONEY_REQUEST_STATUSES = [
  "pendingApproval",
  "approved",
  "rejected",
  "cancelled",
];
// Valid `purpose.simple.category` values for domestic-wire payments.
export const PURPOSE_CATEGORIES = [
  "employee",
  "landlord",
  "vendor",
  "contractor",
  "subsidiary",
  "transferToMyExternalAccount",
  "familyMemberOrFriend",
  "forGoodsOrServices",
  "angelInvestment",
  "savingsOrInvestments",
  "expenses",
  "travel",
  "other",
];
// Categories that require `purpose.simple.additionalInfo`.
export const PURPOSE_ADDITIONAL_INFO_REQUIRED = [
  "vendor",
  "contractor",
  "other",
];
// Categories where `additionalInfo` is optional but must be non-empty when supplied.
export const PURPOSE_ADDITIONAL_INFO_OPTIONAL = [
  "subsidiary",
];

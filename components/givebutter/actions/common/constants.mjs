export const BASE_URL = "https://api.givebutter.com/v1";
export const AUTH_HEADER = "Authorization";
export const CAMPAIGNS_PATH = "/campaigns";
export const CONTACTS_PATH = "/contacts";
export const TRANSACTIONS_PATH = "/transactions";
export const DEFAULT_PER_PAGE = 20;
export const MAX_PER_PAGE = 100;
export const CONTACT_TYPES = Object.freeze([
  "individual",
  "company",
]);
export const CONTACT_SORT_BY = Object.freeze([
  "name_or_company",
  "primary_email",
  "point_of_contact",
  "created_at",
  "total_contributions",
  "recurring_contributions",
  "last_donation_amount",
]);

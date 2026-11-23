// Constants shared by the MailKite components.

// Reject a delivery whose signature timestamp is further than this from now, in either
// direction, so a captured delivery cannot be replayed forever. Same window the MailKite
// SDKs enforce (`DEFAULT_TOLERANCE_MS` in `sdks/node/index.js`).
export const FRESHNESS_MS = 5 * 60 * 1000;

// deploy() backfill bounds. Pipedream's guideline is at most 50 historical events on first
// deploy. `/api/messages` has no domain or direction filter, so those 50 are selected
// client-side out of pages of the account's newest mail — hence a page size and a page cap
// (50 for this domain could otherwise walk the whole account).
export const BACKFILL_LIMIT = 50;
export const BACKFILL_PAGE_SIZE = 200; // the API's maximum `limit`
export const BACKFILL_MAX_PAGES = 5;

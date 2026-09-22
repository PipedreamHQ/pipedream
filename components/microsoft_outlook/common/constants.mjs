/**
 * $filter string used by list-important-mail to retrieve high-importance
 * and flagged messages from the inbox.
 */
export const IMPORTANT_MAIL_FILTER = "importance eq 'high' or flag/flagStatus eq 'flagged'";

/**
 * String value to pass as the $count OData query parameter.
 * Kept as the string "true" (not boolean) so it survives pickBy's falsy filter.
 */
export const COUNT_QUERY_PARAM = "true";

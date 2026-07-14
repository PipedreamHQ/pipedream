// Activity Log endpoint path segment
export const ACTIVITIES = "/activities";

// Event type filter value for task completions (passed in object_event_types query array)
export const OBJECT_EVENT_TYPE_ITEM_COMPLETED = "item:completed";

// Activity log page size bounds (API enforces 1–200)
export const ACTIVITY_LOG_MAX_LIMIT = 200;
export const ACTIVITY_LOG_DEFAULT_LIMIT = 50;

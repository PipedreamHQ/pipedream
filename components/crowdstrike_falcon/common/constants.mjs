// Full enum for /devices/entities/devices-actions/v2 action_name param.
// Only contain and lift_containment are exposed in manage-host-containment options.
export const HOST_ACTION_NAMES = {
  CONTAIN: "contain",
  LIFT_CONTAINMENT: "lift_containment",
  DETECTION_SUPPRESS: "detection_suppress",
  DETECTION_UNSUPPRESS: "detection_unsuppress",
  HIDE_HOST: "hide_host",
  UNHIDE_HOST: "unhide_host",
};

// Fields accepted in the sort param for alert query endpoints.
export const ALERT_SORT_FIELDS = [
  "timestamp",
  "created_timestamp",
  "updated_timestamp",
  "status",
  "severity",
  "aggregate_id",
];

export const DEFAULT_LIMIT = 100;
export const LIMIT_MAX_DEFAULT = 1000;

// Body field name for POST /alerts/entities/alerts/v1.
export const GET_ALERT_ID_BODY_FIELD = "composite_ids";
export const MAX_IDS_PER_REQUEST_ALERTS = 1000;

export const RTR_DEFAULT_SESSION_TIMEOUT = 30;
export const RTR_MAX_SESSION_TIMEOUT = 600;

// Default polling interval: 15 minutes in seconds.
export const DEFAULT_POLLING_SOURCE_TIMER_INTERVAL = 60 * 15;

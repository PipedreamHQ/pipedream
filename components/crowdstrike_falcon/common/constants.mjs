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

export const HOST_ACTION_NAMES_OPTIONS = [
  {
    label: "Contain (isolate from network)",
    value: HOST_ACTION_NAMES.CONTAIN,
  },
  {
    label: "Lift Containment (restore connectivity)",
    value: HOST_ACTION_NAMES.LIFT_CONTAINMENT,
  },
  {
    label: "Detection Suppress",
    value: HOST_ACTION_NAMES.DETECTION_SUPPRESS,
  },
  {
    label: "Detection Unsuppress",
    value: HOST_ACTION_NAMES.DETECTION_UNSUPPRESS,
  },
  {
    label: "Hide Host",
    value: HOST_ACTION_NAMES.HIDE_HOST,
  },
  {
    label: "Unhide Host",
    value: HOST_ACTION_NAMES.UNHIDE_HOST,
  },
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

export const RTR_BASE_COMMANDS = [
  {
    value: "cat",
    label: "View file contents",
  },
  {
    value: "cd",
    label: "Change directory",
  },
  {
    value: "clear",
    label: "Clear the screen",
  },
  {
    value: "csrutil",
    label: "Get system integrity protection status",
  },
  {
    value: "env",
    label: "Display environment variables",
  },
  {
    value: "eventlog",
    label: "Inspect the event log. Subcommands: list, view.",
  },
  {
    value: "filehash",
    label: "Calculate a file hash (MD5 or SHA256)",
  },
  {
    value: "getsid",
    label: "Retrieve the current SID",
  },
  {
    value: "help",
    label: "Access help for a specific command or sub-command",
  },
  {
    value: "history",
    label: "Review command history for the current user",
  },
  {
    value: "ipconfig",
    label: "Review TCP configuration",
  },
  {
    value: "ls",
    label: "List the contents of a directory",
  },
  {
    value: "mount",
    label: "Mount a file system (macOS, Linux) or list available drives (Windows)",
  },
  {
    value: "netstat",
    label: "Retrieve network connection detail",
  },
  {
    value: "ps",
    label: "List running processes",
  },
  {
    value: "reg",
    label: "Registry operations. Subcommands: query.",
  },
];

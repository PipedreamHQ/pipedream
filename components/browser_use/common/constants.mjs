export const DEFAULT_OPTIONS_PAGE_SIZE = 50;

export const MODEL_OPTIONS = [
  {
    label: "Claude Sonnet 4.6",
    value: "claude-sonnet-4.6",
  },
  {
    label: "Claude Opus 4.6",
    value: "claude-opus-4.6",
  },
  {
    label: "Gemini 3 Flash",
    value: "gemini-3-flash",
  },
  {
    label: "BU Mini",
    value: "bu-mini",
  },
  {
    label: "BU Max",
    value: "bu-max",
  },
  {
    label: "BU Ultra",
    value: "bu-ultra",
  },
];

export const CACHE_SCRIPT_OPTIONS = [
  {
    label: "Auto",
    value: "auto",
  },
  {
    label: "Enabled",
    value: "enabled",
  },
  {
    label: "Disabled",
    value: "disabled",
  },
];

export const STOP_STRATEGY_OPTIONS = [
  {
    label: "Stop Task Only",
    value: "task",
  },
  {
    label: "Stop Entire Session",
    value: "session",
  },
];

export const BROWSER_SESSION_STATUS_OPTIONS = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Stopped",
    value: "stopped",
  },
];

export const BROWSER_SESSION_UPDATE_ACTION_OPTIONS = [
  {
    label: "Stop",
    value: "stop",
  },
];

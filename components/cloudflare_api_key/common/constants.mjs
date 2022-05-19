const ZONE_SECURITY_LEVEL_OPTIONS = [
  {
    label: "Off",
    value: "off",
  },
  {
    label: "Essentially Off",
    value: "essentially_off",
  },
  {
    label: "Low",
    value: "low",
  },
  {
    label: "Medium",
    value: "medium",
  },
  {
    label: "High",
    value: "high",
  },
  {
    label: "Under Attack",
    value: "under_attack",
  },
];

const DNS_RECORD_MATCH_OPTIONS = [
  {
    label: "Any",
    value: "any",
  },
  {
    label: "All",
    value: "all",
  },
];

const DEVELOPMENT_MODE_OPTIONS = [
  {
    label: "On",
    value: "on",
  },
  {
    label: "Off",
    value: "off",
  },
];

export default {
  ZONE_SECURITY_LEVEL_OPTIONS,
  DNS_RECORD_MATCH_OPTIONS,
  DEVELOPMENT_MODE_OPTIONS,
};

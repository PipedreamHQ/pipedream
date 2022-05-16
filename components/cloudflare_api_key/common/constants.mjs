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

const DNS_RECORD_DIRECTION_OPTIONS = [
  {
    label: "Asc",
    value: "asc",
  },
  {
    label: "Desc",
    value: "desc",
  },
];

const DNS_RECORD_ORDER_OPTIONS = [
  {
    label: "Type",
    value: "type",
  },
  {
    label: "Name",
    value: "name",
  },
  {
    label: "Content",
    value: "content",
  },
  {
    label: "TTL",
    value: "ttl",
  },
  {
    label: "Proxied",
    value: "proxied",
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
  DNS_RECORD_DIRECTION_OPTIONS,
  DNS_RECORD_ORDER_OPTIONS,
  DEVELOPMENT_MODE_OPTIONS,
};

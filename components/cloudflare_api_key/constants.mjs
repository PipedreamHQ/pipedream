const SECURITY_LEVELS = {
  OFF: "off",
  ESSENTIALLY_OFF: "essentially_off",
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  UNDER_ATTACK: "under_attack",
};

const DEVELOPMENT_MODES = {
  ON: "on",
  OFF: "off",
};

const DNS_RECORD_MATCHES = {
  ANY: "any",
  ALL: "all",
};

const DNS_RECORD_ORDER = {
  TYPE: "type",
  NAME: "name",
  CONTENT: "content",
  TLL: "ttl",
  PROXIED: "proxied",
};

const DNS_RECORD_DIRECTION = {
  ASC: "asc",
  DESC: "desc",
};

export default {
  SECURITY_LEVELS,
  DEVELOPMENT_MODES,
  DNS_RECORD_MATCHES,
  DNS_RECORD_ORDER,
  DNS_RECORD_DIRECTION,
};

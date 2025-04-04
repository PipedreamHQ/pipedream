const DEFAULT_LIMIT = 100;
const SEP = "_";

const REGISTRY_TYPE = {
  NEW: "new",
  TRANSFER: "transfer",
  SUNRISE: "sunrise",
};

const PROTOCOL = {
  XCP: "XCP",
};

const OBJECT_TYPE = {
  DOMAIN: "DOMAIN",
  EVENT: "EVENT",
  ORDER: "ORDER",
  TRANSFER: "TRANSFER",
};

const ACTION_TYPE = {
  SW_REGISTER: "SW_REGISTER",
  SET_DNS_ZONE: "SET_DNS_ZONE",
  TRADE_DOMAIN: "TRADE_DOMAIN",
  POLL: "POLL",
  ACKNOWLEDGE: "ACK",
};

const DEFAULT_NAMESERVER_LIST = [
  "ns1.systemdns.com",
  "ns2.systemdns.com",
  "ns3.systemdns.com",
];

export default {
  DEFAULT_LIMIT,
  SEP,
  REGISTRY_TYPE,
  PROTOCOL,
  OBJECT_TYPE,
  ACTION_TYPE,
  DEFAULT_NAMESERVER_LIST,
};

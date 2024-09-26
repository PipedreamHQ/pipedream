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

const DNS_RECORD_TYPE_OPTIONS = [
  "A",
  "AAAA",
  "CNAME",
  "HTTPS",
  "TXT",
  "SRV",
  "LOC",
  "MX",
  "NS",
  "CERT",
  "DNSKEY",
  "DS",
  "NAPTR",
  "SMIMEA",
  "SSHFP",
  "SVCB",
  "TLSA",
  "URI read only",
];

const ZONE_TYPE_OPTIONS = [
  "full",
  "partial",
];

const CERTIFICATE_REQUEST_TYPE_OPTIONS = [
  "origin-rsa",
  "origin-ecc",
  "keyless-certificate",
];

const IP_ACCESS_RULE_MODE_OPTIONS = [
  "block",
  "challenge",
  "whitelist",
  "js_challenge",
  "managed_challenge",
];

const IP_ACCESS_RULE_TARGET_OPTIONS = [
  {
    label: "IP (e.g. \"198.51.100.4\")",
    value: "ip",
  },
  {
    label: "IP6  (e.g. \"2001:DB8:100::CF\")",
    value: "ip6",
  },
  {
    label: "IP Range (e.g. \"198.51.100.4/16\")",
    value: "ip_range",
  },
  {
    label: "ASN (e.g. \"AS12345\")",
    value: "asn",
  },
  {
    label: "Country (e.g. \"US\")",
    value: "country",
  },
];

export default {
  ZONE_SECURITY_LEVEL_OPTIONS,
  DNS_RECORD_MATCH_OPTIONS,
  DEVELOPMENT_MODE_OPTIONS,
  DNS_RECORD_TYPE_OPTIONS,
  ZONE_TYPE_OPTIONS,
  CERTIFICATE_REQUEST_TYPE_OPTIONS,
  IP_ACCESS_RULE_MODE_OPTIONS,
  IP_ACCESS_RULE_TARGET_OPTIONS,
};

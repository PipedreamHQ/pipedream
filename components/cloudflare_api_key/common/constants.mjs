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

export default {
  ZONE_SECURITY_LEVEL_OPTIONS,
  DNS_RECORD_MATCH_OPTIONS,
  DEVELOPMENT_MODE_OPTIONS,
  DNS_RECORD_TYPE_OPTIONS,
  ZONE_TYPE_OPTIONS,
  CERTIFICATE_REQUEST_TYPE_OPTIONS,
};

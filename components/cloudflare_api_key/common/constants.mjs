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

const DNS_RECORD_TYPE_OPTIONS = [
  "A",
  "AAAA",
  "CNAME",
  "MX",
  "NS",
  "OPENPGPKEY",
  "PTR",
  "TXT",
  "CAA",
  "CERT",
  "DNSKEY",
  "DS",
  "HTTPS",
  "LOC",
  "NAPTR",
  "SMIMEA",
  "SRV",
  "SSHFP",
  "SVCB",
  "TLSA",
  "URI",
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
  DNS_RECORD_MATCH_OPTIONS,
  DNS_RECORD_TYPE_OPTIONS,
  ZONE_TYPE_OPTIONS,
  CERTIFICATE_REQUEST_TYPE_OPTIONS,
  IP_ACCESS_RULE_MODE_OPTIONS,
  IP_ACCESS_RULE_TARGET_OPTIONS,
};

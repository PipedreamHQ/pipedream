export const REPUTATION_OPTIONS = [
  {
    label: "High",
    value: "HIGH",
  },
  {
    label: "Medium",
    value: "MEDIUM",
  },
  {
    label: "Low",
    value: "LOW",
  },
  {
    label: "Bad",
    value: "BAD",
  },
];

export const ERROR_OPTIONS = [
  {
    value: "RATE_LIMIT_EXCEEDED",
    label:
      "The Domain or IP is sending traffic at a suspiciously high rate, due to which temporary rate limits have been imposed. The limit will be lifted when Gmail is confident enough of the nature of the traffic.",
  },
  {
    value: "SUSPECTED_SPAM",
    label:
      "The traffic is suspected to be spam, by Gmail, for various reasons.",
  },
  {
    value: "CONTENT_SPAMMY",
    label: "The traffic is suspected to be spammy, specific to the content.",
  },
  {
    value: "BAD_ATTACHMENT",
    label: "Traffic contains attachments not supported by Gmail.",
  },
  {
    value: "BAD_DMARC_POLICY",
    label: "The sender domain has set up a DMARC rejection policy.",
  },
  {
    value: "LOW_IP_REPUTATION",
    label: "The IP reputation of the sending IP is very low.",
  },
  {
    value: "LOW_DOMAIN_REPUTATION",
    label: "The Domain reputation of the sending domain is very low.",
  },
  {
    value: "IP_IN_RBL",
    label:
      "The IP is listed in one or more public Real-time Blackhole Lists. Work with the RBL to get your IP delisted.",
  },
  {
    value: "DOMAIN_IN_RBL",
    label:
      "The Domain is listed in one or more public Real-time Blackhole Lists. Work with the RBL to get your domain delisted.",
  },
  {
    value: "BAD_PTR_RECORD",
    label: "The sending IP is missing a PTR record.",
  },
];

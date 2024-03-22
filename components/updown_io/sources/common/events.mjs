export default [
  {
    value: "check.down",
    label: "When a check goes down (after confirmation)",
  },
  {
    value: "check.up",
    label: "When a check is back up (recovery following a check.down event)",
  },
  {
    value: "check.ssl_invalid",
    label: "When the SSL certificate is considered invalid",
  },
  {
    value: "check.ssl_valid",
    label: "When the SSL certificate is valid again (recovery after a check.ssl_invalid event)",
  },
  {
    value: "check.ssl_expiration",
    label: "When your SSL certificate approaches expiration date (1, 7, 14, and 30 days before for 1y certs)",
  },
  {
    value: "check.ssl_renewed",
    label: "When the SSL certificate was renewed close to expiration (recovery for check.ssl_expiration)",
  },
  {
    value: "check.performance_drop",
    label: "When the Apex drops more than 30% below the lowest of the last 5 hours",
  },
];

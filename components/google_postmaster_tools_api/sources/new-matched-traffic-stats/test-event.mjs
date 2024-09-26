export default {
  name: "domains/domain.com/trafficStats/20240412",
  userReportedSpamRatio: 0.001,
  ipReputations: [
    {
      reputation: "BAD",
    },
    {
      reputation: "LOW",
    },
    {
      reputation: "MEDIUM",
    },
    {
      reputation: "HIGH",
      ipCount: "13",
      sampleIps: [
        "51.345.124.153",
        "51.345.7.112",
        "51.345.7.114",
        "51.345.7.30-51.345.7.33",
        "51.345.7.35-51.345.7.37",
        "51.345.7.46",
        "51.345.7.92",
        "51.345.7.99",
      ],
    },
  ],
  domainReputation: "MEDIUM",
  spfSuccessRatio: 1,
  dkimSuccessRatio: 1,
  dmarcSuccessRatio: 1,
  inboundEncryptionRatio: 1,
  deliveryErrors: [
    {
      errorClass: "TEMPORARY_ERROR",
      errorType: "SUSPECTED_SPAM",
    },
    {
      errorClass: "PERMANENT_ERROR",
      errorType: "BAD_ATTACHMENT",
      errorRatio: 0.002,
    },
  ],
};

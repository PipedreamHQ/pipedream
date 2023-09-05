export default {
  ORDER_BY_DIRECTION: [
    "asc",
    "desc",
  ],
  retreiveAllRequests: {
    STATUS: [
      "accepted",
      "rejected",
    ],
    REJECTION_CAUSE: [
      "SOURCE_ARCHIVED",
      "NO_WEBHOOK",
      "VERIFICATION_FAILED",
      "UNSUPPORTED_HTTP_METHOD",
      "UNSUPPORTED_CONTENT_TYPE",
      "UNPARSABLE_JSON",
      "PAYLOAD_TOO_LARGE",
      "INGESTION_FATAL",
      "UNKNOWN",
    ],
    ORDER_BY: [
      "ingested_at",
      "created_at",
    ],
  },
};


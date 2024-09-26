export default {
  ORDER_BY_DIRECTION: [
    "asc",
    "desc",
  ],
  retrieveAllRequests: {
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
  retrieveRequestEvents: {
    ORDER_BY: [
      "last_attempt_at",
      "created_at",
    ],
    STATUS: [
      "SCHEDULED",
      "QUEUED",
      "HOLD",
      "SUCCESSFUL",
      "FAILED",
    ],
  },
};


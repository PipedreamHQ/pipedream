export default {
  BASE_URL: "https://api.veriff.me/v1",
  WEBHOOK_EVENTS: {
    SESSION_COMPLETED: "session.completed",
    SESSION_APPROVED: "session.approved",
    SESSION_DECLINED: "session.declined",
    SESSION_RESUBMITTED: "session.resubmitted",
  },
  VERIFICATION_STATUS: {
    APPROVED: "approved",
    DECLINED: "declined",
    RESUBMITTED: "resubmitted",
    PENDING: "pending",
  },
  GENDER_OPTIONS: [
    {
      label: "Male",
      value: "M",
    },
    {
      label: "Female",
      value: "F",
    },
  ],
  MARITAL_STATUS_OPTIONS: [
    {
      label: "Single",
      value: "single",
    },
    {
      label: "Married",
      value: "married",
    },
    {
      label: "Divorced",
      value: "divorced",
    },
    {
      label: "Widowed",
      value: "widowed",
    },
  ],
  DOCUMENT_TYPE_OPTIONS: [
    {
      label: "Id Card",
      value: "ID_CARD",
    },
    {
      label: "Passport",
      value: "PASSPORT",
    },
    {
      label: "Driver's License",
      value: "DRIVERS_LICENSE",
    },
    {
      label: "Residence Permit",
      value: "RESIDENCE_PERMIT",
    },
  ],
  ID_CARD_TYPE_OPTIONS: [
    "CE",
    "TI",
  ],
};


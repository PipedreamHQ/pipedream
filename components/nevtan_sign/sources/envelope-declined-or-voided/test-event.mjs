import sample from "../common/sample-envelope.mjs";

export default {
  ...sample,
  "status": 5,
  "mail_sent": true,
  "updated_at": "2026-11-12T10:41:09.300000",
  "participants": sample.participants.map((participant) => ({
    ...participant,
    "status": 3,
    "viewed_at": "2026-11-12T10:39:55.004000",
    "rejected_reason": "The payment terms are not what we agreed.",
  })),
};

import sample from "../common/sample-envelope.mjs";

export default {
  ...sample,
  "status": 4,
  "mail_sent": true,
  "updated_at": "2026-11-12T14:02:47.905000",
  "signed_at": "2026-11-12T14:02:47.905000",
  "participants": sample.participants.map((participant) => ({
    ...participant,
    "status": 2,
    "viewed_at": "2026-11-12T13:58:10.220000",
    "signed_at": "2026-11-12T14:02:47.905000",
  })),
};

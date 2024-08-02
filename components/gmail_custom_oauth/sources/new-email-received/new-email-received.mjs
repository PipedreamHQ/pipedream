import common from "../common/polling.mjs";
import base from "../../../gmail/sources/new-email-received/new-email-received.mjs";

export default {
  ...common,
  key: "gmail_custom_oauth-new-email-received",
  name: "New Email Received",
  description: "Emit new event when an email is received. This source is capped at 100 max new messages per run.",
  version: "0.0.12",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    ...base.methods,
  },
};

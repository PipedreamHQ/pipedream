import base from "../../../gmail/sources/new-sent-email/new-sent-email.mjs";
import common from "../common/polling-messages.mjs";

export default {
  ...base,
  key: "gmail_custom_oauth-new-sent-email",
  name: "New Sent Email",
  description: "Emit new event for each new email sent. (Maximum of 100 events emited per execution)",
  version: "0.0.9",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    ...base.methods,
  },
};

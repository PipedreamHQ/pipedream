import common from "../common/polling.mjs";
import base from "../../../gmail/sources/new-attachment-received/new-attachment-received.mjs";

export default {
  ...common,
  key: "gmail_custom_oauth-new-attachment-received",
  name: "New Attachment Received",
  description: "Emit new event for each attachment in a message received. This source is capped at 100 max new messages per run.",
  version: "0.0.11",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    ...base.methods,
  },
};

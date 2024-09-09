import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "krispcall-new-sms-or-mms-instant",
  name: "New SMS or MMS Sent (Instant)",
  description: "Emit new event when a new SMS or MMS is sent.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getAction() {
      return "new_sms_or_mms";
    },
    getSummary(body) {
      return `New SMS/MMS sent from ${body.from_number} to ${body.to_number}`;
    },
  },
  sampleEmit,
};

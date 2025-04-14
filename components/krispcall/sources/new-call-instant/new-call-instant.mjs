import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "krispcall-new-call-instant",
  name: "New Call (Instant)",
  description: "Emit new event when a new call is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getAction() {
      return "new_call_log";
    },
    getSummary(body) {
      return `New call from ${body.call_from} to ${body.call_to}`;
    },
  },
  sampleEmit,
};

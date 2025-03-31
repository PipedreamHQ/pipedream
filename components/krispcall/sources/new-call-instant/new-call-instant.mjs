import common from "../common/base.mjs";

export default {
  ...common,
  key: "krispcall-new-call-instant",
  name: "New Call (Instant)",
  description: "Emit new event when a new call is created.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getAction() {
      return "new_call_log";
    },
    getSummary(body) {
      return `New call created: ${body.id}`;
    },
  },
};

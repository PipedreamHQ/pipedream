import common from "../common/base.mjs";

export default {
  ...common,
  key: "justcall-new-missed-call",
  name: "New Missed Call (Instant)",
  description: "Emit new event when a call is missed.",
  version: "0.1.0",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getWebhookType() {
      return "call.missed";
    },
    generateMeta(data) {
      const { request_id: id } = data;
      return {
        id,
        summary: `New missed call with id: ${id}!`,
        ts: Date.now(),
      };
    },
  },
};

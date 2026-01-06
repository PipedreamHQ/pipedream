import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "aircall-new-sms",
  name: "New SMS",
  description: "Emit new event when a new SMS is received.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents() {
      return [];
    },
    getEventType() {
      return "message.received";
    },
    generateMeta(data) {
      return {
        id: data.id,
        summary: `New SMS received from ${data.raw_digits} to ${data.number.digits}`,
        ts: data.created_at,
      };
    },
  },
};

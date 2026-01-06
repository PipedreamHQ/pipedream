import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "aircall-new-call-ended",
  name: "New Call Ended",
  description: "Emit new event when a call ends",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents() {
      const { calls } = await this.aircall.listCalls({
        per_page: 25,
        order: "desc",
      });
      return calls;
    },
    getEventType() {
      return "call.ended";
    },
    generateMeta(call) {
      return {
        id: `${call.id}${call.ended_at}`,
        summary: call.raw_digits,
        ts: call.ended_at,
      };
    },
  },
};

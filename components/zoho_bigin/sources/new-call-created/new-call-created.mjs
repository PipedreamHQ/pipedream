import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Call Created (Instant)",
  version: "0.0.1",
  key: "zoho_bigin-new-call-created",
  description: "Emit new event on each created call.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventTypes() {
      return [
        "Calls.create",
      ];
    },
    async emitEvent(data) {
      const { data: calls } = await this.app.getCall({
        callId: data.ids[0],
      });

      console.log(calls);

      const call = calls[0];

      await this.$emit(call, {
        id: call.id,
        summary: `New call created with ID ${call.id}`,
        ts: Date.parse(call.Created_Time),
      });
    },
  },
};

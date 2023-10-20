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
    async deploy() {
      const { data: calls } = await this.app.getCalls({
        params: {
          per_page: 10,
        },
      });

      await Promise.all(calls.map(this.emitEvent));
    },
    async emitEvent(data) {
      const { data: calls } = await this.app.getCall({
        callId: data?.id ?? data?.ids[0],
      });

      const call = calls[0];

      await this.$emit(call, {
        id: call.id,
        summary: `New call created with ID ${call.id}`,
        ts: Date.parse(call.Created_Time),
      });
    },
  },
};

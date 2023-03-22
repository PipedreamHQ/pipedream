import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Transfer Created (Instant)",
  version: "0.0.4",
  key: "wise-new-transfer-created",
  description: "Emit new event for a transfer created.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "transfers#state-change";
    },
    emitEvent(body) {
      const data = body?.data;

      this.$emit(data, {
        id: data.resource.id,
        summary: `New transfer created with ID ${data.resource.id}`,
        ts: Date.parse(data.occurred_at),
      });
    },
  },
};

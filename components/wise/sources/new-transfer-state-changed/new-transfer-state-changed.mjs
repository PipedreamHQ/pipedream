import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Transfer State Changed (Instant)",
  version: "0.0.5",
  key: "wise-new-transfer-state-changed",
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
        id: `${data.resource.id} - ${data.current_state}`,
        summary: `New transfer status changed with ID ${data.resource.id}`,
        ts: Date.parse(data.occurred_at),
      });
    },
  },
};

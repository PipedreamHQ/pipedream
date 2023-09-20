import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Transfer Completed (Instant)",
  version: "0.0.5",
  key: "wise-new-transfer-completed",
  description: "Emit new event for a transfer completed.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "transfers#state-change";
    },
    emitEvent(body) {
      const data = body?.data;

      if (data.current_state !== "outgoing_payment_sent") {
        return;
      }

      this.$emit(data, {
        id: data.resource.id,
        summary: `New transfer created with ID ${data.resource.id}`,
        ts: Date.parse(data.occurred_at),
      });
    },
  },
};

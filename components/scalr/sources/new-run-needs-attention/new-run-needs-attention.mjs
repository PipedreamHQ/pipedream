import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Run Needs Attention (Instant)",
  version: "0.0.1",
  key: "scalr-new-run-needs-attention",
  description: "Emit new event when a new run needs attention. [See the documentation](https://docs.scalr.io/reference/create_webhook_integration)",
  type: "source",
  dedupe: "unique",
  hooks: {
    ...common.hooks,
  },
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "run:needs_attention";
    },
    async emitEvent(data) {

      this.$emit(data, {
        id: data.run.id,
        summary: `New run with ID ${data.run.id} needs attention`,
        ts: Date.parse(data.run["created-at"]),
      });
    },
  },
};

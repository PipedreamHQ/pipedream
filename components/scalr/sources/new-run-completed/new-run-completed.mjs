import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Run Completed (Instant)",
  version: "0.0.1",
  key: "scalr-new-run-completed",
  description: "Emit new event on each new completed run. [See the documentation](https://docs.scalr.io/reference/create_webhook_integration)",
  type: "source",
  dedupe: "unique",
  hooks: {
    ...common.hooks,
  },
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "run:completed";
    },
    async emitEvent(data) {

      this.$emit(data, {
        id: data.run.id,
        summary: `New run completed with ID ${data.run.id}`,
        ts: Date.parse(data.run["created-at"]),
      });
    },
  },
};

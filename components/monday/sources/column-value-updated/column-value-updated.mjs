import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "monday-column-value-updated",
  name: "New Column Value Updated (Instant)",
  description: "Emit new event when a column value is updated on a board in Monday. For changes to Name, use the Name Updated Trigger.",
  type: "source",
  version: "0.0.5",
  dedupe: "unique",
  hooks: {
    ...common.hooks,
    async deploy() {
      await this.commonDeploy();
    },
  },
  methods: {
    ...common.methods,
    getWebhookArgs() {
      return {
        event: "change_column_value",
      };
    },
  },
};

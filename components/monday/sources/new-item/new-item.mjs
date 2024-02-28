import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "monday-new-item",
  name: "New Item (Instant)",
  description: "Emit new event when a new item is added to a board in Monday.",
  type: "source",
  version: "0.0.6",
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
        event: "create_item",
      };
    },
  },
};

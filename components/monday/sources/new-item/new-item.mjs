import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "monday-new-item",
  name: "New Item Created (Instant)",
  description: "Emit new event when a new item is added to a board. [See the documentation](https://developer.monday.com/api-reference/reference/webhooks#sample-payload-for-webhook-events)",
  type: "source",
  version: "0.0.9",
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

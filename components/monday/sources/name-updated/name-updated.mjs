import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "monday-name-updated",
  name: "Name Updated (Instant)",
  description: "Emit new event when an item's name is updated. [See the documentation](https://developer.monday.com/api-reference/reference/webhooks#sample-payload-for-webhook-events)",
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
        event: "change_name",
      };
    },
  },
};

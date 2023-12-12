import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "monday-name-updated",
  name: "New Name Updated (Instant)",
  description: "Emit new event when an item's Name is updated on a board in Monday.",
  type: "source",
  version: "0.0.4",
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

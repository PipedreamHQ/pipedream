import common from "../common/common.mjs";

export default {
  ...common,
  key: "monday-new-item",
  name: "New Item",
  description: "Emit new event when a new item is added to a board in Monday.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  hooks: {
    ...common.hooks,
    async deploy() {
      // todo: get historical events
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

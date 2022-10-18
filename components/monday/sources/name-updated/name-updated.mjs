import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "monday-name-updated",
  name: "Name Updated",
  description: "Emit new event when an item's Name is updated on a board in Monday.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookArgs() {
      return {
        event: "change_name",
      };
    },
  },
};

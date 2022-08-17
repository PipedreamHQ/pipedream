import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "monday-column-value-updated",
  name: "Column Value Updated",
  description: "Emit new event when a column value is updated on a board in Monday.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookArgs() {
      return {
        event: "change_column_value",
      };
    },
  },
};

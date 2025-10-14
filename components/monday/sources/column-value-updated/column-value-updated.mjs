import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "monday-column-value-updated",
  name: "Column Value Updated (Instant)",
  description: "Emit new event when a column value is updated on a board. [See the documentation](https://developer.monday.com/api-reference/reference/webhooks#sample-payload-for-webhook-events)",
  type: "source",
  version: "0.0.10",
  dedupe: "unique",
  hooks: {
    ...common.hooks,
    async deploy() {
      await this.commonDeploy();
    },
  },
  props: {
    ...common.props,
    alertBox: {
      type: "alert",
      alertType: "warning",
      content: "For changes to `Name`, use the **Name Updated** trigger",
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

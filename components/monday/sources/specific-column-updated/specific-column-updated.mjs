import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "monday-specific-column-updated",
  name: "Specific Column Updated (Instant)",
  description: "Emit new event when a value in the specified column is updated. [See the documentation](https://developer.monday.com/api-reference/reference/webhooks#sample-payload-for-webhook-events)",
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
    column: {
      propDefinition: [
        common.props.monday,
        "column",
        (c) => ({
          boardId: c.boardId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getWebhookArgs() {
      return {
        event: "change_specific_column_value",
        config: JSON.stringify({
          columnId: this.column,
        }),
      };
    },
  },
};

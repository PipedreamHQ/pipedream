import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "monday-subitem-name-updated",
  name: "Sub-Item Name Updated (Instant)",
  description: "Emit new event when a sub-item name changes. [See the documentation](https://developer.monday.com/api-reference/reference/webhooks#sample-payload-for-webhook-events)",
  type: "source",
  version: "0.0.8",
  dedupe: "unique",
  props: {
    ...common.props,
    alertBox: {
      type: "alert",
      alertType: "warning",
      content: "To create this trigger, you need to have at least one subitem previously created on your board",
    },
    boardId: {
      propDefinition: [
        common.props.monday,
        "boardId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getWebhookCreationError() {
      return "Failed to establish webhook. To create this trigger, you need to have at least one subitem previously created on your board";
    },
    getWebhookArgs() {
      return {
        event: "change_subitem_name",
      };
    },
    getSummary({ event: { pulseId } }) {
      return `The name of sub-item with id ${pulseId} was changed.`;
    },
  },
};

import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "monday-new-subitem-update",
  name: "New Sub-Item Update (Instant)",
  description: "Emit new event when an update is posted in sub-items. [See the documentation](https://developer.monday.com/api-reference/reference/webhooks#sample-payload-for-webhook-events)",
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
        event: "create_subitem_update",
      };
    },
    getSummary({ event: { pulseId } }) {
      return `New update with id ${pulseId} was created.`;
    },
  },
};

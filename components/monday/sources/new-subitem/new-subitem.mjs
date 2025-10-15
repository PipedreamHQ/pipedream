import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "monday-new-subitem",
  name: "New Sub-Item Created (Instant)",
  description: "Emit new event when a sub-item is created. [See the documentation](https://developer.monday.com/api-reference/reference/webhooks#sample-payload-for-webhook-events)",
  type: "source",
  version: "0.0.9",
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
        event: "create_subitem",
      };
    },
    getSummary({ event: { pulseId } }) {
      return `New sub-item with id ${pulseId} was created.`;
    },
  },
};

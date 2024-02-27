import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "monday-subitem-name-updated",
  name: "New Sub-Item Name Updated (Instant)",
  description: "Emit new event when a sub-item name changes. To create this trigger, you need to have at least one subitem previously created on your board.",
  type: "source",
  version: "0.0.5",
  dedupe: "unique",
  props: {
    ...common.props,
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
      return "Failed to establish webhook. To create this trigger, you need to have at least one subitem previously created on your board.";
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

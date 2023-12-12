import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "monday-new-subitem",
  name: "New Sub-Item (Instant)",
  description: "Emit new event when a sub-item is created. To create this trigger, you need to have at least one subitem previously created on your board.",
  type: "source",
  version: "0.0.3",
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
        event: "create_subitem",
      };
    },
    getSummary({ event: { pulseId } }) {
      return `New sub-item with id ${pulseId} was created.`;
    },
  },
};

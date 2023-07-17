import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "monday-new-subitem-update",
  name: "New Sub-Item Update (Instant)",
  description: "Emit new event when an update is posted in sub-items. To create this trigger, you need to have at least one subitem previously created on your board.",
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
        event: "create_subitem_update",
      };
    },
    getSummary({ event: { pulseId } }) {
      return `New update with id ${pulseId} was created.`;
    },
  },
};

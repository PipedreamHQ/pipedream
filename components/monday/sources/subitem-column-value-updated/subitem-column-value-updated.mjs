import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "monday-subitem-column-value-updated",
  name: "New Sub-Item Column Value Updated (Instant)",
  description: "Emit new event when any sub-item column changes. To create this trigger, you need to have at least one subitem previously created on your board.",
  type: "source",
  version: "0.0.6",
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
        event: "change_subitem_column_value",
      };
    },
    getSummary({
      event: {
        columnId,
        pulseId,
      },
    }) {
      return `The column ${columnId} of sub-item with id ${pulseId} was changed.`;
    },
  },
};

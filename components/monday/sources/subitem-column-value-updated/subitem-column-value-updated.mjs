import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "monday-subitem-column-value-updated",
  name: "New Sub-Item Column Value Updated",
  description: "Emit new event when any sub-item column changes.",
  type: "source",
  version: "0.0.1",
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

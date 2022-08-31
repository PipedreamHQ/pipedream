import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "monday-specific-column-updated",
  name: "Specific Column Updated",
  description: "Emit new event when a value in the specified column is updated on a board in Monday. For changes to Name, use the Name Updated Trigger.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
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

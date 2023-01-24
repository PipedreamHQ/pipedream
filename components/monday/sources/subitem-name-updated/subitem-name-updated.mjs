import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "monday-subitem-name-updated",
  name: "New Sub-Item Name Updated (Instant)",
  description: "Emit new event when a sub-item name changes.",
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
        event: "change_subitem_name",
      };
    },
    getSummary({ event: { pulseId } }) {
      return `The name of sub-item with id ${pulseId} was changed.`;
    },
  },
};

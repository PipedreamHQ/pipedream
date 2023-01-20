import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "monday-new-subitem",
  name: "New Sub-Item",
  description: "Emit new event when a sub-item is created.",
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
        event: "create_subitem",
      };
    },
    getSummary({ event: { pulseId } }) {
      return `New sub-item with id ${pulseId} was created.`;
    },
  },
};

import gmail from "../../gmail.app.mjs";
import common from "../common/polling-history.mjs";

export default {
  ...common,
  key: "gmail-new-email-received",
  name: "New Email Received",
  description: "Emit new event when a new email is received.",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    gmail,
    label: {
      propDefinition: [
        gmail,
        "label",
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getHistoryTypes() {
      return [
        "messageAdded",
      ];
    },
    generateMeta(message) {
      return {
        id: message.id,
        summary: `A new message with ID: ${message.id} was received"`,
        ts: message.internalDate,
      };
    },
    filterHistory(history) {
      return this.label
        ? history.filter((item) =>
          item.messagesAdded?.length
            && item.messagesAdded[0].message.labelIds
            && item.messagesAdded[0].message.labelIds.includes(this.label))
        : history.filter((item) => item.messagesAdded?.length);
    },
  },
};

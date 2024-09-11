import gmail from "../../gmail.app.mjs";
import common from "../common/polling-history.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "gmail-new-labeled-email",
  name: "New Labeled Email",
  description: "Emit new event when a new email is labeled.",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    ...common.props,
    gmail,
    label: {
      propDefinition: [
        gmail,
        "label",
      ],
    },
  },
  methods: {
    ...common.methods,
    getHistoryTypes() {
      return [
        "labelAdded",
        "messageAdded",
      ];
    },
    generateMeta(message) {
      return {
        id: `${message.id}-${this.label}`,
        summary: `A new message with ID: ${message.id} was labeled with "${this.label}"`,
        ts: Date.now(),
      };
    },
    filterHistory(history) {
      return history.filter((item) =>
        (item.labelsAdded && item.labelsAdded[0].labelIds.includes(this.label))
        || (item.messagesAdded
          && item.messagesAdded[0].message.labelIds
          && item.messagesAdded[0].message.labelIds.includes(this.label)));
    },
  },
  sampleEmit,
};

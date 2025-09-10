import gmail from "../../gmail.app.mjs";
import common from "../common/polling-history.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "gmail-new-labeled-email",
  name: "New Labeled Email",
  description: "Emit new event when a new email is labeled.",
  type: "source",
  version: "0.1.1",
  dedupe: "unique",
  props: {
    gmail,
    ...common.props,
    labels: {
      propDefinition: [
        gmail,
        "label",
      ],
      type: "string[]",
      label: "Labels",
    },
    withTextPayload: {
      type: "boolean",
      label: "Return payload as plaintext",
      description: "Convert the payload response into a single text field. **This reduces the size of the payload and makes it easier for LLMs work with.**",
      default: false,
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
        id: `${message.id}-${message.historyId}`,
        summary: `A new message with ID: ${message.id} was labeled"`,
        ts: +message.internalDate,
      };
    },
    filterHistory(history) {
      return history.filter((item) =>
        (item.labelsAdded && item.labelsAdded[0].labelIds.some((i) => this.labels.includes(i)))
        || (item.messagesAdded
          && item.messagesAdded[0].message.labelIds
          && item.messagesAdded[0].message.labelIds.some((i) => this.labels.includes(i))));
    },
  },
  sampleEmit,
};

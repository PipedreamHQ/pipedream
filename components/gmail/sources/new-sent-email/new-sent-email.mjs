import gmail from "../../gmail.app.mjs";
import common from "../common/polling-messages.mjs";

export default {
  ...common,
  key: "gmail-new-sent-email",
  name: "New Sent Email",
  description: "Emit new event for each new email sent. (Maximum of 100 events emited per execution)",
  version: "0.1.1",
  type: "source",
  dedupe: "unique",
  props: {
    gmail,
    ...common.props,
    q: {
      propDefinition: [
        gmail,
        "q",
      ],
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
    getLabels() {
      return [
        "SENT",
      ];
    },
    generateMeta(message) {
      return {
        id: message.id,
        summary: message.snippet,
        ts: +message.internalDate,
      };
    },
  },
};

import gmail from "../../gmail.app.mjs";
import common from "../common/polling-messages.mjs";

export default {
  ...common,
  key: "gmail-new-sent-email",
  name: "New Sent Email",
  description: "Emit new event for each new email sent. (Maximum of 100 events emited per execution)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    gmail,
    q: {
      propDefinition: [
        gmail,
        "q",
      ],
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
        ts: new Date(message.internalDate),
      };
    },
  },
};

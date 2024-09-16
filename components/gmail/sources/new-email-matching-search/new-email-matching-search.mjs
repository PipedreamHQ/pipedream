import gmail from "../../gmail.app.mjs";
import common from "../common/polling-messages.mjs";

export default {
  ...common,
  key: "gmail-new-email-matching-search",
  name: "New Email Matching Search",
  description: "Emit new event when an email matching the search criteria is received. This source is capped at 100 max new messages per run.",
  version: "0.0.2",
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
    labels: {
      propDefinition: [
        gmail,
        "label",
      ],
      type: "string[]",
      label: "Labels",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getLabels() {
      return this.labels;
    },
    generateMeta(message) {
      const selectedHeader = message.payload.headers.find(({ name }) => name === "Subject");
      const subject = selectedHeader?.value || "No subject";
      return {
        id: message.id,
        summary: `New email: ${subject}`,
        ts: message.internalDate,
      };
    },
  },
};

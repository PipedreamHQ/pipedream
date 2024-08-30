import common from "../common.mjs";

const DOCS_LINK = "https://developers.pandadoc.com/reference/create-webhooks-subscription";

export default {
  ...common,
  name: "Recipient Completed (Instant)",
  description:
    `Emit new event when a recipient completes a document. [See the documentation here](${DOCS_LINK})`,
  key: "pandadoc-recipient-completed",
  version: "0.0.5",
  type: "source",
  methods: {
    ...common.methods,
    getHookName() {
      return "Recipient Completed";
    },
    getHookTypes() {
      return [
        "recipient_completed",
      ];
    },
  },
};

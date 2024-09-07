import common from "../common.mjs";

const DOCS_LINK = "https://developers.pandadoc.com/reference/create-webhooks-subscription";

export default {
  ...common,
  name: "Document State Changed (Instant)",
  description:
    `Emit new event when a document's state is changed. [See the documentation here](${DOCS_LINK})`,
  key: "pandadoc-document-state-changed",
  version: "0.0.5",
  type: "source",
  methods: {
    ...common.methods,
    getHookName() {
      return "Document State Changed";
    },
    getHookTypes() {
      return [
        "document_state_changed",
      ];
    },
  },
};

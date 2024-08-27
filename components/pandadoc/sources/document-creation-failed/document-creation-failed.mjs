import common from "../common.mjs";

const DOCS_LINK = "https://developers.pandadoc.com/reference/create-webhooks-subscription";

export default {
  ...common,
  name: "Document Creation Failed (Instant)",
  description:
    `Emit new event when a document failed to be created. [See the documentation here](${DOCS_LINK})`,
  key: "pandadoc-document-creation-failed",
  version: "0.0.5",
  type: "source",
  methods: {
    ...common.methods,
    getHookName() {
      return "Document Creation Failed";
    },
    getHookTypes() {
      return [
        "document_creation_failed",
      ];
    },
  },
};

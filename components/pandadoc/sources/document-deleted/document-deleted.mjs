import common from "../common.mjs";

const DOCS_LINK = "https://developers.pandadoc.com/reference/create-webhooks-subscription";

export default {
  ...common,
  name: "Document Deleted (Instant)",
  description:
    `Emit new event when a document is deleted. [See the documentation here](${DOCS_LINK})`,
  key: "pandadoc-document-deleted",
  version: "0.0.5",
  type: "source",
  methods: {
    ...common.methods,
    getHookName() {
      return "Document Deleted";
    },
    getHookTypes() {
      return [
        "document_deleted",
      ];
    },
  },
};

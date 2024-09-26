import common from "../common.mjs";

const DOCS_LINK = "https://developers.pandadoc.com/reference/create-webhooks-subscription";

export default {
  ...common,
  name: "Document Updated (Instant)",
  description:
    `Emit new event when a document is updated. [See the documentation here](${DOCS_LINK})`,
  key: "pandadoc-document-updated",
  version: "0.0.5",
  type: "source",
  methods: {
    ...common.methods,
    getHookName() {
      return "Document Updated";
    },
    getHookTypes() {
      return [
        "document_updated",
      ];
    },
  },
};

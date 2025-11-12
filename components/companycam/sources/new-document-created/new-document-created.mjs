import common from "../common/webhook.mjs";
import scopes from "../common/scopes.mjs";

export default {
  ...common,
  key: "companycam-new-document-created",
  name: "New Document Created (Instant)",
  description: "Emit new event when a new document is created. [See the docs](https://docs.companycam.com/docs/webhooks-1).",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getScopes() {
      return [
        scopes.DOCUMENT_CREATED,
      ];
    },
    generateMeta(resource) {
      const { payload } = resource;
      return {
        id: payload.document.id,
        summary: `New Document: ${payload.document.name}`,
        ts: resource.created_at,
      };
    },
  },
};

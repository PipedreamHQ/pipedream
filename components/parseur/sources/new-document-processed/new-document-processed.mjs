import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "parseur-new-document-processed",
  name: "New Document Processed",
  description: "Emit new event when a new document is processed. It is useful for endpoints that don't support deep JSON structures as it will flatten your table fields. [See the docs](https://help.parseur.com/en/articles/3566155-send-parsed-data-using-webhooks).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.DOCUMENT_PROCESSED_FLATTENED;
    },
    generateMeta() {
      const ts = Date.now();
      return {
        id: ts,
        summary: "New Document Processed",
        ts,
      };
    },
  },
};

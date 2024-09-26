import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "parseur-new-document-processed-with-list-items",
  name: "New Document Processed (With List Items)",
  description: "Emit new event when a new document is processed with list items. The payload format is the same as when viewing the document and clicking on `view as JSON`. [See the docs](https://help.parseur.com/en/articles/3566155-send-parsed-data-using-webhooks).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.DOCUMENT_PROCESSED;
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

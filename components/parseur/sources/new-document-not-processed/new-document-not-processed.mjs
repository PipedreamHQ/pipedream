import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "parseur-new-document-not-processed",
  name: "New Document Not Processed",
  description: "Emit new event when a new document is not processed. It is triggered when a document fails to process with status `New Template Needed`. [See the docs](https://help.parseur.com/en/articles/3566155-send-parsed-data-using-webhooks).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.DOCUMENT_TEMPLATE_NEEDED;
    },
    generateMeta() {
      const ts = Date.now();
      return {
        id: ts,
        summary: "New Document Not Processed",
        ts,
      };
    },
  },
};

import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "sign_plus-new-document-completed",
  name: "New Document Completed (Instant)",
  description: "Emit new event when a new document is completed. [See the documentation](https://apidoc.sign.plus/api-reference/endpoints/signplus/create-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "ENVELOPE_COMPLETED";
    },
    generateMeta({ data }) {
      return {
        id: data.id,
        summary: `New Document Completed: ${data.file_name}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};

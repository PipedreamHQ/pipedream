import common from "../common/common-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zoho_desk-deleted-article-instant",
  name: "Deleted Article (Instant)",
  description: "Emit new event when an article is deleted from the recycle bin",
  type: "source",
  version: "0.0.6",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSubscriptions() {
      return {
        Article_Delete: null,
      };
    },
    generateMeta(payload) {
      return {
        id: payload.id,
        summary: `Article Deleted: ${payload.id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};

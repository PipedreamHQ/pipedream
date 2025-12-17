import common from "../common/common-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zoho_desk-new-article-instant",
  name: "New Article (Instant)",
  description: "Emit new event when a new article is created",
  type: "source",
  version: "0.0.5",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSubscriptions() {
      return {
        Article_Add: null,
      };
    },
    generateMeta(payload) {
      return {
        id: payload.id,
        summary: `New Article Created: ${payload.title}`,
        ts: Date.parse(payload.createdTime),
      };
    },
  },
  sampleEmit,
};

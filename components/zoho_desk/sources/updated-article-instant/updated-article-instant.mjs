import common from "../common/common-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zoho_desk-updated-article-instant",
  name: "Updated Article (Instant)",
  description: "Emit new event when an article is updated",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSubscriptions() {
      return {
        Article_Update: null,
      };
    },
    generateMeta(payload) {
      const ts = Date.parse(payload.modifiedTime);
      return {
        id: `${payload.id}-${ts}`,
        summary: `Article Updated: ${payload.title}`,
        ts,
      };
    },
  },
  sampleEmit,
};

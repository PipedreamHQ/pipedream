import common from "../common/webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "shopify-collection-updated",
  name: "Collection Updated (Instant)",
  description: "Emit new event whenever a collection is updated, including whenever products are added or removed from a collection.",
  version: "0.0.9",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "COLLECTIONS_UPDATE";
    },
    generateMeta(collection) {
      const ts = Date.parse(collection.updated_at);
      return {
        id: `${collection.id}${ts}`,
        summary: `Collection Updated: ${collection.title}`,
        ts,
      };
    },
  },
  sampleEmit,
};

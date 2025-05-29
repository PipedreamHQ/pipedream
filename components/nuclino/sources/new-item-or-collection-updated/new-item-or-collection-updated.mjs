import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "nuclino-new-item-or-collection-updated",
  name: "New Item or Collection Updated",
  description: "Emit new event when an item or collection is updated in Nuclino.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsField() {
      return "lastUpdatedAt";
    },
    generateMeta(item) {
      const ts = Date.parse(item[this.getTsField()]);
      return {
        id: `${item.id}${ts}`,
        summary: `Item updated: ${item.id}`,
        ts,
      };
    },
  },
  sampleEmit,
};

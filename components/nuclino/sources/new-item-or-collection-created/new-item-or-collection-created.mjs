import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "nuclino-new-item-or-collection-created",
  name: "New Item or Collection Created",
  description: "Emit new event when a new item or collection is created in Nuclino.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsField() {
      return "createdAt";
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New item created: ${item.id}`,
        ts: Date.parse(item[this.getTsField()]),
      };
    },
  },
  sampleEmit,
};

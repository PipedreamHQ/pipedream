import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "airfocus-new-item-updated",
  name: "New Item Updated",
  description: "Emit new event when an existing item gets updated.",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFilterField() {
      return "lastUpdatedAt";
    },
    getSummary(item) {
      return `New Item Updated: ${item.name}`;
    },
  },
  sampleEmit,
};

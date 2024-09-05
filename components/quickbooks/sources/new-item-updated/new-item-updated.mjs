import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "quickbooks-new-item-updated",
  name: "New Item Updated",
  description: "Emit new event when an item is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getQuery(lastDate) {
      return `select * from Item Where Metadata.LastUpdatedTime >= '${lastDate}' orderby Metadata.LastUpdatedTime desc`;
    },
    getFieldList() {
      return "Item";
    },
    getFieldDate() {
      return "LastUpdatedTime";
    },
    getSummary(item) {
      return `New Item Updated: ${item.Id}`;
    },
  },
  sampleEmit,
};

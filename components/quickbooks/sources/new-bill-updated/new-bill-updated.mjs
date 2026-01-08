import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "quickbooks-new-bill-updated",
  name: "New Bill Updated",
  description: "Emit new event when a bill is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getQuery(lastDate) {
      return `select * from Bill Where Metadata.LastUpdatedTime >= '${lastDate}' orderby Metadata.LastUpdatedTime desc`;
    },
    getFieldList() {
      return "Bill";
    },
    getFieldDate() {
      return "LastUpdatedTime";
    },
    getSummary(item) {
      return `New Bill Updated: ${item.Id}`;
    },
  },
  sampleEmit,
};

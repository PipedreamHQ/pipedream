import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "quickbooks-new-invoice-updated",
  name: "New Invoice Updated",
  description: "Emit new event when an invoice is updated.",
  version: "0.0.9",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getQuery(lastDate) {
      return `select * from Invoice Where Metadata.LastUpdatedTime >= '${lastDate}' orderby Metadata.LastUpdatedTime desc`;
    },
    getFieldList() {
      return "Invoice";
    },
    getFieldDate() {
      return "LastUpdatedTime";
    },
    getSummary(item) {
      return `New Invoice Updated: ${item.Id}`;
    },
  },
  sampleEmit,
};

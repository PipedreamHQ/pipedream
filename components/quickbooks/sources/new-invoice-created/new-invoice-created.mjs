import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "quickbooks-new-invoice-created",
  name: "New Invoice Created",
  description: "Emit new event when a new invoice is created.",
  version: "0.0.9",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getQuery(lastDate) {
      return `select * from Invoice Where Metadata.CreateTime >= '${lastDate}' orderby Metadata.CreateTime desc`;
    },
    getFieldList() {
      return "Invoice";
    },
    getSummary(item) {
      return `New Invoice: ${item.Id}`;
    },
  },
  sampleEmit,
};

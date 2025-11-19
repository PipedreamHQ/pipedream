import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "quickbooks-new-purchase-created",
  name: "New Purchase Created",
  description: "Emit new event when a new purchase is created.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getQuery(lastDate) {
      return `select * from Purchase Where Metadata.CreateTime >= '${lastDate}' orderby Metadata.CreateTime desc`;
    },
    getFieldList() {
      return "Purchase";
    },
    getSummary(item) {
      return `New Purchase: ${item.Id}`;
    },
  },
  sampleEmit,
};

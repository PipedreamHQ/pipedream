import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "quickbooks-new-bill-created",
  name: "New Bill Created",
  description: "Emit new event when a new Bill is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getQuery(lastDate) {
      return `select * from Bill Where Metadata.CreateTime >= '${lastDate}' orderby Metadata.CreateTime desc`;
    },
    getFieldList() {
      return "Bill";
    },
    getSummary(item) {
      return `New Bill: ${item.Id}`;
    },
  },
  sampleEmit,
};

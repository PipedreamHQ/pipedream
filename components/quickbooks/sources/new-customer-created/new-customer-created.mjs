import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "quickbooks-new-customer-created",
  name: "New Customer Created",
  description: "Emit new event when a new customer is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getQuery(lastDate) {
      return `select * from Customer Where Metadata.CreateTime >= '${lastDate}' orderby Metadata.CreateTime desc`;
    },
    getFieldList() {
      return "Customer";
    },
    getFieldDate() {
      return "CreateTime";
    },
    getSummary(item) {
      return `New Customer: ${item.Id}`;
    },
  },
  sampleEmit,
};

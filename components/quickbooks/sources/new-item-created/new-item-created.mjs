import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "quickbooks-new-item-created",
  name: "New Item Created",
  description: "Emit new event when a new item is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getQuery(lastDate) {
      return `select * from Item Where Metadata.CreateTime >= '${lastDate}' orderby Metadata.CreateTime desc`;
    },
    getFieldList() {
      return "Item";
    },
    getFieldDate() {
      return "CreateTime";
    },
    getSummary(item) {
      return `New Item: ${item.Id}`;
    },
  },
  sampleEmit,
};

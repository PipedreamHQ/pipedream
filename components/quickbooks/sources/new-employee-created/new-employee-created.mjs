import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "quickbooks-new-employee-created",
  name: "New Employee Created",
  description: "Emit new event when a new employee is created.",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getQuery(lastDate) {
      return `select * from Employee Where Metadata.CreateTime >= '${lastDate}' orderby Metadata.CreateTime desc`;
    },
    getFieldList() {
      return "Employee";
    },
    getFieldDate() {
      return "CreateTime";
    },
    getSummary(item) {
      return `New Employee: ${item.Id}`;
    },
  },
  sampleEmit,
};

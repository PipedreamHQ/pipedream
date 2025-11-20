import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "quickbooks-new-employee-updated",
  name: "New Employee Updated",
  description: "Emit new event when an employee is updated.",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getQuery(lastDate) {
      return `select * from Employee Where Metadata.LastUpdatedTime >= '${lastDate}' orderby Metadata.LastUpdatedTime desc`;
    },
    getFieldList() {
      return "Employee";
    },
    getFieldDate() {
      return "LastUpdatedTime";
    },
    getSummary(item) {
      return `Employee Updated: ${item.Id}`;
    },
  },
  sampleEmit,
};

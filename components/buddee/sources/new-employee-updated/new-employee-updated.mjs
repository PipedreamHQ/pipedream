import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  name: "Employee Updated",
  description: "Emit new event when an employee is updated in the system",
  key: "buddee-new-employee-updated",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.buddee.getEmployees;
    },
    getSortKey() {
      return "updated_at";
    },
    getSummary(item) {
      return `Updated Employee: ${item.full_name}`;
    },
  },
  sampleEmit,
};

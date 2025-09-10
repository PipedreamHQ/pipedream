import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  name: "New Employee Created",
  description: "Emit new event when a new employee is added to the system",
  key: "buddee-new-employee-created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.buddee.getEmployees;
    },
    getSortKey() {
      return "created_at";
    },
    getSummary(item) {
      return `New Employee: ${item.full_name}`;
    },
  },
  sampleEmit,
};

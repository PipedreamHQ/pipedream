import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  name: "Employee Updated",
  description: "Emit new event when an employee is updated in the system. [See the documentation](https://developers.buddee.nl/#fd057d3c-8b40-4808-a4d2-eeffc5da82d7)",
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

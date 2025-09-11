import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  name: "New Employee Created",
  description: "Emit new event when a new employee is added to the system. [See the documentation](https://developers.buddee.nl/#fd057d3c-8b40-4808-a4d2-eeffc5da82d7)",
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

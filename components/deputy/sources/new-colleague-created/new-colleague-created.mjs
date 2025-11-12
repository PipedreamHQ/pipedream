import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "deputy-new-colleague-created",
  name: "New Colleague Created (Instant)",
  description: "Emit new event when a new individual is added to the workplace",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "Employee.Insert";
    },
    generateMeta(employee) {
      return {
        id: employee.Id,
        summary: `New Employee: ${employee.Id}`,
        ts: Date.parse(employee.Created),
      };
    },
  },
  sampleEmit,
};

import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "kiwihr-new-employee",
  name: "New Employee",
  description: "Emit new event when a new employee is added to KiwiHR.",
  version: "1.0.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.kiwihr.listUsers;
    },
    getFieldName() {
      return "users";
    },
    getVariables() {
      return {
        sort: [
          {
            "field": "id",
            "direction": "desc",
          },
        ],
      };
    },
    getSummary(item) {
      return `New employee: ${item.firstName} ${item.lastName}`;
    },
  },
  sampleEmit,
};

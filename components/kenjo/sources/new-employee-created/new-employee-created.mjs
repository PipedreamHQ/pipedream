import common from "../common/base.mjs";

export default {
  ...common,
  key: "kenjo-new-employee-created",
  name: "New Employee Created",
  description: "Emit new event when a new employee is added in Kenjo. [See the documentation](https://kenjo.readme.io/reference/get_employees)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.kenjo.listEmployees;
    },
    getResourceKey() {
      return "data";
    },
    generateMeta(employee) {
      return {
        id: employee._id,
        summary: `New Employee: ${employee.email}`,
        ts: Date.now(),
      };
    },
  },
};

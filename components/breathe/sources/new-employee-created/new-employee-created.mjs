import common from "../common/base.mjs";

export default {
  ...common,
  key: "breathe-new-employee-created",
  name: "New Employee Created",
  description: "Emit new event when a new employee is created in Breathe. [See the documentation](https://developer.breathehr.com/examples#!/employees/GET_version_employees_json).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsField() {
      return "created_at";
    },
    getResourceFn() {
      return this.breathe.listEmployees;
    },
    getResourceKey() {
      return "employees";
    },
    generateMeta(employee) {
      return {
        id: employee.id,
        summary: `New Employee: ${employee.first_name} ${employee.last_name}`,
        ts: Date.parse(employee.created_at),
      };
    },
  },
};

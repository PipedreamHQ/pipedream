import common from "../common/base.mjs";

export default {
  ...common,
  key: "breathe-employee-updated",
  name: "Employee Updated",
  description: "Emit new event when an existing employee is updated in Breathe. [See the documentation](https://developer.breathehr.com/examples#!/employees/GET_version_employees_json)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsField() {
      return "updated_at";
    },
    getResourceFn() {
      return this.breathe.listEmployees;
    },
    getResourceKey() {
      return "employees";
    },
    isRelevant(employee) {
      return !(employee.created_at === employee.updated_at);
    },
    generateMeta(employee) {
      const ts = Date.parse(employee.updated_at);
      return {
        id: `${employee.id}-${ts}`,
        summary: `Employee Updated: ${employee.first_name} ${employee.last_name}`,
        ts,
      };
    },
  },
};

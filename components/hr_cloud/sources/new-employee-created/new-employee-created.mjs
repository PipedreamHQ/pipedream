import common from "../common/base.mjs";

export default {
  ...common,
  key: "hr_cloud-new-employee-created",
  name: "New Employee Created",
  description: "Emit new event when a new employee is added to the system. [See the documentation](https://help.hrcloud.com/api/#/employee#GET_employee)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.hrCloud.getEmployees;
    },
    getTsField() {
      return "xCreatedOn";
    },
    generateMeta(employee) {
      return {
        id: employee.Id,
        summary: `New Employee: ${employee.xFirstName} ${employee.xLastName}`,
        ts: Date.parse(employee[this.getTsField()]),
      };
    },
  },
};

import charthop from "../../charthop.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "charthop-create-employee",
  name: "Create Employee",
  description: "Adds a new employee to the system. [See the documentation](https://docs.charthop.com)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    charthop: {
      type: "app",
      app: "charthop",
    },
    addEmployeeName: {
      propDefinition: [
        charthop,
        "addEmployeeName",
      ],
    },
    addEmployeeEmail: {
      propDefinition: [
        charthop,
        "addEmployeeEmail",
      ],
    },
    addEmployeeRole: {
      propDefinition: [
        charthop,
        "addEmployeeRole",
      ],
    },
    addEmployeeStartDate: {
      propDefinition: [
        charthop,
        "addEmployeeStartDate",
      ],
    },
    addEmployeeDepartment: {
      propDefinition: [
        charthop,
        "addEmployeeDepartment",
      ],
    },
    addEmployeeCustomFields: {
      propDefinition: [
        charthop,
        "addEmployeeCustomFields",
      ],
    },
  },
  async run({ $ }) {
    const employee = await this.charthop.addEmployee();
    $.export("$summary", `Created employee ${this.addEmployeeName}`);
    return employee;
  },
};

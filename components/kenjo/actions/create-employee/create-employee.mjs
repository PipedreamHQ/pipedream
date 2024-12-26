import kenjo from "../../kenjo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "kenjo-create-employee",
  name: "Create Employee",
  description: "Creates a new employee in Kenjo. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    kenjo,
    createEmployeeName: {
      propDefinition: [
        kenjo,
        "createEmployeeName",
      ],
    },
    createEmployeeEmail: {
      propDefinition: [
        kenjo,
        "createEmployeeEmail",
      ],
    },
    createEmployeeDepartment: {
      propDefinition: [
        kenjo,
        "createEmployeeDepartment",
      ],
    },
    createEmployeeRole: {
      propDefinition: [
        kenjo,
        "createEmployeeRole",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.kenjo.createEmployee({
      name: this.createEmployeeName,
      email: this.createEmployeeEmail,
      department_id: this.createEmployeeDepartment,
      role_id: this.createEmployeeRole,
    });
    $.export("$summary", `Created employee ${response.name}`);
    return response;
  },
};

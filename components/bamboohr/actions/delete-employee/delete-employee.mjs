import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-delete-employee",
  name: "Delete Employee",
  description: "Permanently delete an employee record and all associated data (DELETE /employees/{id}). This cannot be undone. Use **Get Employees Directory** or **Get Employee** to find the employee ID first. [See the documentation](https://documentation.bamboohr.com/reference/delete-employee)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  ai: "optimized",
  props: {
    bamboohr,
    employeeId: {
      propDefinition: [
        bamboohr,
        "employeeId",
      ],
      description: "The employee ID to permanently delete, e.g. `100`. Run **Get Employees Directory** to discover IDs.",
    },
  },
  async run({ $ }) {
    await this.bamboohr.deleteEmployee({
      $,
      employeeId: this.employeeId,
    });
    $.export("$summary", `Deleted employee ${this.employeeId}`);
  },
};

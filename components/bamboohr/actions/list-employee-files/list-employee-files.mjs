import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-list-employee-files",
  name: "List Employee Files",
  description: "List file metadata (grouped by category) for an employee (GET /employees/{id}/files/view). Use the returned file IDs with **Get Employee File**. Run **Get Employees Directory** to find the employee ID. [See the documentation](https://documentation.bamboohr.com/reference/list-employee-files)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bamboohr,
    employeeId: {
      propDefinition: [
        bamboohr,
        "employeeId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.listEmployeeFiles({
      $,
      employeeId: this.employeeId,
    });
    $.export("$summary", `Retrieved files for employee ${this.employeeId}`);
    return response;
  },
};

import app from "../../onbee_app.app.mjs";

export default {
  key: "onbee_app-delete-employee",
  name: "Delete Employee",
  description: "Delete an employee with the specified ID. [See the documentation](https://docs.onboardee.io/api/#tag/Employees/paths/~1employees~1edit~1{id}/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    employeeId: {
      propDefinition: [
        app,
        "employeeId",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.deleteEmployee({
      $,
      employeeId: this.employeeId,
    });

    $.export("$summary", `Successfully deleted Employee with ID '${this.employeeId}'`);

    return response;
  },
};

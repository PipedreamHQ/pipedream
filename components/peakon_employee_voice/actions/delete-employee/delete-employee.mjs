import app from "../../peakon_employee_voice.app.mjs";

export default {
  key: "peakon_employee_voice-delete-employee",
  name: "Delete Employee",
  description:
    "Permanently deletes an employee record from Peakon. This action is irreversible — "
    + "the employee and all associated survey data will be removed. "
    + "Use **List Employees** to find the employee's `id` first. "
    + "Returns a confirmation when deletion succeeds. "
    + "[See the Peakon API documentation](https://developer.peakon.com/reference/delete_employees-employeeid)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    await this.app.deleteEmployee({
      $,
      employeeId: this.employeeId,
    });
    $.export("$summary", `Deleted employee ${this.employeeId}`);
    return {
      id: this.employeeId,
      deleted: true,
    };
  },
};

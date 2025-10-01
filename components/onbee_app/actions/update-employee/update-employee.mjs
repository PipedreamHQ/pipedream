import app from "../../onbee_app.app.mjs";

export default {
  key: "onbee_app-update-employee",
  name: "Update Employee",
  description: "Update an employee with the specified ID. [See the documentation](https://docs.onboardee.io/api/#tag/Employees/paths/~1employees~1edit~1{id}/post)",
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
    firstname: {
      propDefinition: [
        app,
        "firstname",
      ],
      optional: true,
    },
    surname: {
      propDefinition: [
        app,
        "surname",
      ],
      optional: true,
    },
    privateEmail: {
      propDefinition: [
        app,
        "privateEmail",
      ],
    },
    workEmail: {
      propDefinition: [
        app,
        "workEmail",
      ],
    },
    dateOfBirth: {
      propDefinition: [
        app,
        "dateOfBirth",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.updateEmployee({
      $,
      employeeId: this.employeeId,
      data: {
        firstname: this.firstname,
        surname: this.surname,
        privateEmail: this.privateEmail,
        workEmail: this.workEmail,
        dateOfBirth: this.dateOfBirth,
      },
    });

    $.export("$summary", `Successfully updated Employee with ID '${response.payload._id}'`);

    return response;
  },
};

import app from "../../onbee_app.app.mjs";

export default {
  key: "onbee_app-create-employee",
  name: "Create Employee",
  description: "Adds an employee to the system. [See the documentation](https://docs.onboardee.io/api/#tag/Employees/paths/~1employees~1add/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    firstname: {
      propDefinition: [
        app,
        "firstname",
      ],
    },
    surname: {
      propDefinition: [
        app,
        "surname",
      ],
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
    const response = await this.app.createEmployee({
      $,
      data: {
        firstname: this.firstname,
        surname: this.surname,
        privateEmail: this.privateEmail,
        workEmail: this.workEmail,
        dateOfBirth: this.dateOfBirth,
      },
    });

    $.export("$summary", `Successfully created Employee with ID '${response.payload._id}'`);

    return response;
  },
};

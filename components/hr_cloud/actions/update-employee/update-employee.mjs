import hrCloud from "../../hr_cloud.app.mjs";

export default {
  key: "hr_cloud-update-employee",
  name: "Update Employee",
  description: "Update an existing employee. [See the documentation](https://help.hrcloud.com/api/#/employee#PUT_employee)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hrCloud,
    employeeId: {
      propDefinition: [
        hrCloud,
        "employeeId",
      ],
    },
    email: {
      propDefinition: [
        hrCloud,
        "email",
      ],
      optional: true,
    },
    firstName: {
      propDefinition: [
        hrCloud,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        hrCloud,
        "lastName",
      ],
      optional: true,
    },
    address: {
      propDefinition: [
        hrCloud,
        "address",
      ],
    },
    city: {
      propDefinition: [
        hrCloud,
        "city",
      ],
    },
    state: {
      propDefinition: [
        hrCloud,
        "state",
      ],
    },
    zip: {
      propDefinition: [
        hrCloud,
        "zip",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hrCloud.updateEmployee({
      $,
      data: {
        Id: this.employeeId,
        xPersonalEmail: this.email,
        xFirstName: this.firstName,
        xLastName: this.lastName,
        xAddress1: this.address,
        xCity: this.city,
        xState: this.state,
        xZipCode: this.zip,
      },
    });
    $.export("$summary", `Successfully updated employee: ${response[0].xFirstName} ${response[0].xLastName}`);
    return response;
  },
};

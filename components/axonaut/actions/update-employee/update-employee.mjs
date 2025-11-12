import app from "../../axonaut.app.mjs";

export default {
  name: "Update Employee",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "axonaut-update-employee",
  description: "Updates a employee. [See documentation (Go to `POST /api/v2/employees`)](https://axonaut.com/api/v2/doc)",
  type: "action",
  props: {
    app,
    employeeId: {
      propDefinition: [
        app,
        "employeeId",
      ],
    },
    firstName: {
      label: "First Name",
      description: "The first name of the employee",
      type: "string",
      optional: true,
    },
    lastName: {
      label: "Last Name",
      description: "The last name of the employee",
      type: "string",
      optional: true,
    },
    email: {
      label: "Email",
      description: "The email of the employee",
      type: "string",
      optional: true,
    },
    phoneNumber: {
      label: "Phone Number",
      description: "The phone number of the employee",
      type: "string",
      optional: true,
    },
    customFields: {
      label: "Custom Fields",
      description: "The custom fields of the employee. E.g `{ \"myCustomField\": \"myCustomValue\" }`",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const customFields = typeof this.customFields === "string"
      ? JSON.parse(this.customFields)
      : this.customFields;

    const response = await this.app.updateEmployee({
      $,
      employeeId: this.employeeId,
      data: {
        company_id: this.companyId,
        firstname: this.firstName,
        lastname: this.lastName,
        email: this.email,
        phone_number: this.phoneNumber,
        custom_fields: customFields,
      },
    });

    if (response) {
      $.export("$summary", `Successfully updated employee with ID ${response.id}`);
    }

    return response;
  },
};

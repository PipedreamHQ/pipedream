import app from "../../axonaut.app.mjs";

export default {
  name: "Create Employee",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "axonaut-create-employee",
  description: "Creates a employee. [See documentation (Go to `POST /api/v2/employees`)](https://axonaut.com/api/v2/doc)",
  type: "action",
  props: {
    app,
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
    },
    firstName: {
      label: "First Name",
      description: "The first name of the employee",
      type: "string",
    },
    lastName: {
      label: "Last Name",
      description: "The last name of the employee",
      type: "string",
    },
    email: {
      label: "Email",
      description: "The email of the employee",
      type: "string",
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

    const response = await this.app.createEmployee({
      $,
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
      $.export("$summary", `Successfully created employee with ID ${response.id}`);
    }

    return response;
  },
};

import app from "../../peakon_employee_voice.app.mjs";

export default {
  key: "peakon_employee_voice-create-employee",
  name: "Create Employee",
  description:
    "Creates a new employee record in Peakon. Requires `firstName`, `lastName`, and `identifier` "
    + "(the HR employee number, e.g. `E001` — must be unique). "
    + "Optional standard fields: `email`, `employeeType` (permanent/contractor/temporary/volunteer/other), "
    + "`employmentStatus`. "
    + "Custom HR attributes such as Department, Region, and Job Level can be set via `customAttributes` "
    + "as a JSON object — e.g. `{\"Department\": \"Sales\", \"Region\": \"North America\"}`. "
    + "Returns the new employee record including the internal `id`, which can be used with "
    + "**Update Employee** or **Delete Employee**. "
    + "[See the Peakon API documentation](https://developer.peakon.com/reference/post_employees)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    identifier: {
      propDefinition: [
        app,
        "identifier",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "Employee's work email address.",
      optional: true,
    },
    employeeType: {
      type: "string",
      label: "Employee Type",
      description: "Employment type.",
      options: [
        "permanent",
        "contractor",
        "temporary",
        "volunteer",
        "other",
      ],
      optional: true,
      default: "permanent",
    },
    employmentStatus: {
      propDefinition: [
        app,
        "employmentStatus",
      ],
      default: "employed",
    },
    customAttributes: {
      propDefinition: [
        app,
        "customAttributes",
      ],
    },
  },
  async run({ $ }) {
    const custom = this.customAttributes
      ? JSON.parse(this.customAttributes)
      : {};
    const response = await this.app.createEmployee({
      $,
      attributes: {
        firstName: this.firstName,
        lastName: this.lastName,
        identifier: this.identifier,
        email: this.email,
        type: this.employeeType,
        employmentStatus: this.employmentStatus,
        ...custom,
      },
    });
    const employee = response.data;
    $.export("$summary", `Created employee ${employee.attributes.name} (ID: ${employee.id})`);
    return response;
  },
};

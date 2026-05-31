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
      type: "string",
      label: "First Name",
      description: "Employee's first name.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Employee's last name.",
    },
    identifier: {
      type: "string",
      label: "Identifier",
      description: "HR employee number or unique identifier (e.g. `E001`). Must be unique across employees.",
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
      type: "string",
      label: "Employment Status",
      description: "Current employment status (e.g. `employed`, `on_leave`).",
      optional: true,
      default: "employed",
    },
    customAttributes: {
      type: "string",
      label: "Custom Attributes",
      description:
        "JSON object of custom HR attributes to set on the employee. "
        + "Example: `{\"Department\": \"Sales\", \"Region\": \"North America\", \"Job Level\": \"Manager\"}`. "
        + "Enum values are accepted as plain strings.",
      optional: true,
    },
  },
  async run({ $ }) {
    const custom = this.customAttributes
      ? JSON.parse(this.customAttributes)
      : {};
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/api/v1/employees",
      data: {
        data: {
          type: "employees",
          attributes: {
            firstName: this.firstName,
            lastName: this.lastName,
            identifier: this.identifier,
            ...(this.email && {
              email: this.email,
            }),
            type: this.employeeType,
            employmentStatus: this.employmentStatus,
            ...custom,
          },
        },
      },
    });
    const employee = response.data;
    $.export("$summary", `Created employee ${employee.attributes.name} (ID: ${employee.id})`);
    return response;
  },
};

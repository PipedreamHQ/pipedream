import app from "../../peakon_employee_voice.app.mjs";

export default {
  key: "peakon_employee_voice-update-employee",
  name: "Update Employee",
  description:
    "Partially updates an existing employee's attributes using their internal ID. "
    + "Only the fields you provide will be updated — omitted fields are left unchanged. "
    + "Use **List Employees** to find the employee's `id` first. "
    + "Standard fields: `firstName`, `lastName`, `identifier`, `employmentStatus`. "
    + "Custom HR attributes (Department, Region, Job Level, etc.) can be updated via `customAttributes` "
    + "as a JSON object — e.g. `{\"Department\": \"Engineering\"}`. "
    + "Enum attribute values are accepted as plain strings; Peakon resolves option IDs internally. "
    + "[See the Peakon API documentation](https://developer.peakon.com/reference/patch_employees-employeeid)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
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
    firstName: {
      type: "string",
      label: "First Name",
      description: "Updated first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Updated last name.",
      optional: true,
    },
    identifier: {
      type: "string",
      label: "Identifier",
      description: "Updated HR employee number.",
      optional: true,
    },
    employmentStatus: {
      type: "string",
      label: "Employment Status",
      description: "Updated employment status (e.g. `employed`, `on_leave`).",
      optional: true,
    },
    customAttributes: {
      type: "string",
      label: "Custom Attributes",
      description:
        "JSON object of custom HR attributes to update. "
        + "Example: `{\"Department\": \"Engineering\", \"Job Level\": \"Senior Manager\"}`. "
        + "Only provided attributes are changed.",
      optional: true,
    },
  },
  async run({ $ }) {
    const custom = this.customAttributes
      ? JSON.parse(this.customAttributes)
      : {};
    const standardAttrs = {};
    if (this.firstName !== undefined) standardAttrs.firstName = this.firstName;
    if (this.lastName !== undefined) standardAttrs.lastName = this.lastName;
    if (this.identifier !== undefined) standardAttrs.identifier = this.identifier;
    if (this.employmentStatus !== undefined) standardAttrs.employmentStatus = this.employmentStatus;
    const response = await this.app._makeRequest({
      $,
      method: "PATCH",
      path: `/api/v1/employees/${this.employeeId}`,
      data: {
        data: {
          type: "employees",
          id: this.employeeId,
          attributes: {
            ...standardAttrs,
            ...custom,
          },
        },
      },
    });
    $.export("$summary", `Updated employee ${this.employeeId}`);
    return response;
  },
};

import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-update-employee",
  name: "Update Employee",
  description: "Update fields on an existing employee (POST /employees/{id}). Only supplied fields are changed; unknown field names are silently ignored. Use **Get Employees Directory** to find the employee ID. [See the documentation](https://documentation.bamboohr.com/reference/update-employee)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  ai: "optimized",
  props: {
    bamboohr,
    employeeId: {
      propDefinition: [
        bamboohr,
        "employeeId",
      ],
      description: "The employee ID to update (e.g. `100`). Run **Get Employees Directory** to discover IDs.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name.",
      optional: true,
    },
    workEmail: {
      type: "string",
      label: "Work Email",
      description: "Work email address.",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Job title.",
      optional: true,
    },
    department: {
      type: "string",
      label: "Department",
      description: "Department name.",
      optional: true,
    },
    division: {
      type: "string",
      label: "Division",
      description: "Division name.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "Location name.",
      optional: true,
    },
    hireDate: {
      type: "string",
      label: "Hire Date",
      description: "Hire date in YYYY-MM-DD format, e.g. `2026-01-31`.",
      optional: true,
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Additional writable fields as name-value pairs, e.g. `{\"mobilePhone\":\"555-1234\",\"address1\":\"1 Main St\"}`. Unrecognized names are silently ignored, so use the exact field names/aliases listed in BambooHR's [Field Names reference](https://documentation.bamboohr.com/docs/list-of-field-names).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.updateEmployee({
      $,
      employeeId: this.employeeId,
      data: {
        ...this.additionalFields,
        ...Object.fromEntries(
          Object.entries({
            firstName: this.firstName,
            lastName: this.lastName,
            workEmail: this.workEmail,
            jobTitle: this.jobTitle,
            department: this.department,
            division: this.division,
            location: this.location,
            hireDate: this.hireDate,
          }).filter(([
            ,
            value,
          ]) => value !== undefined),
        ),
      },
    });
    $.export("$summary", `Updated employee ${this.employeeId}`);
    return response;
  },
};

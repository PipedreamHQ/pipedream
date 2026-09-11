import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-add-employee",
  name: "Add Employee",
  description: "Create a new employee (POST /employees). `firstName` and `lastName` are required; any other valid writable field can be supplied via Additional Fields. Returns a Location header with the new employee ID. [See the documentation](https://documentation.bamboohr.com/reference/create-employee)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    bamboohr,
    firstName: {
      type: "string",
      label: "First Name",
      description: "Employee first name, e.g. `Jane`.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Employee last name, e.g. `Doe`.",
    },
    workEmail: {
      type: "string",
      label: "Work Email",
      description: "Work email address, e.g. `jane.doe@example.com`.",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Job title, e.g. `Software Engineer`.",
      optional: true,
    },
    department: {
      type: "string",
      label: "Department",
      description: "Department name, e.g. `Engineering`.",
      optional: true,
    },
    hireDate: {
      type: "string",
      label: "Hire Date",
      description: "Hire date in YYYY-MM-DD format, e.g. `2026-01-15`.",
      optional: true,
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Additional writable employee fields as name-value pairs, e.g. `{\"division\":\"Sales\",\"mobilePhone\":\"555-1234\"}`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.createEmployee({
      $,
      returnFullResponse: true,
      data: {
        ...this.additionalFields,
        ...Object.fromEntries(
          Object.entries({
            firstName: this.firstName,
            lastName: this.lastName,
            workEmail: this.workEmail,
            jobTitle: this.jobTitle,
            department: this.department,
            hireDate: this.hireDate,
          }).filter(([
            ,
            value,
          ]) => value !== undefined),
        ),
      },
    });
    const locationHeader = response.headers?.location ?? "";
    const newEmployeeId = locationHeader.split("/").pop();
    $.export("$summary", `Created employee ${this.firstName} ${this.lastName}${newEmployeeId
      ? ` (ID: ${newEmployeeId})`
      : ""}`);
    return {
      employeeId: newEmployeeId || undefined,
      location: locationHeader || undefined,
    };
  },
};

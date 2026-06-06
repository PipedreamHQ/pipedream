import app from "../../peakon_employee_voice.app.mjs";

export default {
  key: "peakon_employee_voice-list-employees",
  name: "List Employees",
  description:
    "Lists employee records in Peakon. Use the filter parameters to narrow results by email, "
    + "account ID, admin status, employee ID, manager status, or segment membership. "
    + "Returns each employee's internal `id`, name, identifier (HR employee number), "
    + "employment status, and custom HR attributes (Department, Region, Job Level, etc.). "
    + "The `id` field returned here is required by **Update Employee** and **Delete Employee**. "
    + "Call this first whenever the user refers to an employee by name or attribute and you need "
    + "their ID to perform an update or deletion. "
    + "[See the Peakon API documentation](https://developer.peakon.com/reference/get_employees)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    filterEmail: {
      type: "string",
      label: "Filter by Email",
      description: "Filter employees by account email address.",
      optional: true,
    },
    filterAccountId: {
      type: "integer",
      label: "Filter by Account ID",
      description: "Filter employees by their account ID.",
      optional: true,
    },
    filterAdmin: {
      type: "boolean",
      label: "Filter Admins Only",
      description: "When true, returns only employees with admin access.",
      optional: true,
    },
    filterEmployeeId: {
      type: "integer",
      label: "Filter by Employee ID",
      description: "Filter by the employee's internal numeric ID.",
      optional: true,
      async options() {
        const response = await this.app.listEmployees({
          params: {},
        });
        return (response.data ?? []).map((emp) => ({
          label: `${emp.attributes.name} (${emp.attributes.identifier})`,
          value: parseInt(emp.id),
        }));
      },
    },
    filterManager: {
      type: "boolean",
      label: "Filter Managers Only",
      description: "When true, returns only employees who are managers.",
      optional: true,
    },
    filterSegmentIds: {
      type: "string",
      label: "Filter by Segment IDs",
      description:
        "Comma-separated list of segment IDs to filter employees by segment membership. "
        + "Example: `1001,1002`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      "filter[account.email]": this.filterEmail,
      "filter[accountId]": this.filterAccountId,
      "filter[admin]": this.filterAdmin,
      "filter[employeeId]": this.filterEmployeeId,
      "filter[manager]": this.filterManager,
      "filter[segmentIds]": this.filterSegmentIds,
    };
    const response = await this.app.listEmployees({
      $,
      params,
    });
    const employees = response.data ?? [];
    $.export("$summary", `Found ${employees.length} employee(s)`);
    return response;
  },
};

import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-list-timesheet-entries",
  name: "List Timesheet Entries",
  description: "List legacy timesheet entries grouped by employee within a date range (GET /time_tracking/timesheet_entries). Dates must be within the last 365 days. [See the documentation](https://documentation.bamboohr.com/reference/list-timesheet-entries)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bamboohr,
    start: {
      type: "string",
      label: "Start",
      description: "Start of range in YYYY-MM-DD format (within last 365 days).",
    },
    end: {
      type: "string",
      label: "End",
      description: "End of range in YYYY-MM-DD format.",
    },
    employeeIds: {
      type: "string",
      label: "Employee IDs",
      description: "Comma-separated employee IDs to filter, e.g. `100,101`. Run **Get Employees Directory** to discover IDs.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.listTimesheetEntries({
      $,
      params: {
        start: this.start,
        end: this.end,
        employeeIds: this.employeeIds,
      },
    });
    $.export("$summary", `Retrieved timesheet entries from ${this.start} to ${this.end}`);
    return response;
  },
};

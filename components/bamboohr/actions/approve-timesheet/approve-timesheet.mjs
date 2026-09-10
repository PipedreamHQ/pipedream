import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-approve-timesheet",
  name: "Approve Timesheet",
  description: "Approve a timesheet (POST /time-tracking/timesheet-approvals). Only approval is supported by the API; there is no reject/deny endpoint. `lastChangedAt` must be the timesheet's `hoursLastChangedAt` value from **Get Timesheet**. [See the documentation](https://documentation.bamboohr.com/reference/approve-timesheet)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    bamboohr,
    timesheetId: {
      propDefinition: [
        bamboohr,
        "timesheetId",
      ],
      description: "The timesheet ID to approve, e.g. `456`. Run **List Timesheets** to discover IDs.",
    },
    lastChangedAt: {
      type: "string",
      label: "Last Changed At",
      description: "ISO 8601 UTC value from the timesheet's `hoursLastChangedAt` (via **Get Timesheet**), for optimistic concurrency, e.g. `2026-01-15T18:30:00Z`.",
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.approveTimesheet({
      $,
      data: {
        timesheetId: parseInt(this.timesheetId, 10),
        lastChangedAt: this.lastChangedAt,
      },
    });
    $.export("$summary", `Approved timesheet ${this.timesheetId}`);
    return response;
  },
};

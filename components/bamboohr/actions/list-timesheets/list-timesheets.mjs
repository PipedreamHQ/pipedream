import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-list-timesheets",
  name: "List Timesheets",
  description: "List timesheets with optional OData filtering and sorting (GET /time-tracking/timesheets). Status values are OPEN, PENDING_APPROVAL, APPROVED. Use returned IDs with **Get Timesheet** and **Approve Timesheet**. [See the documentation](https://documentation.bamboohr.com/reference/list-timesheets)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bamboohr,
    filter: {
      type: "string",
      label: "Filter",
      description: "OData filter over employeeId, status, startDate, endDate, e.g. `status eq 'PENDING_APPROVAL'`.",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort over startDate, endDate, approvedAt, updatedAt (default `startDate desc`).",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number, starting at 1.",
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Results per page. Min 1, max 200 (default 50).",
      min: 1,
      max: 200,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.listTimesheets({
      $,
      params: {
        "$filter": this.filter,
        "$sort": this.sort,
        "page": this.page,
        "pageSize": this.pageSize,
      },
    });
    const timesheets = response?.data ?? (Array.isArray(response)
      ? response
      : []);
    $.export("$summary", `Retrieved ${timesheets.length} timesheet${timesheets.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};

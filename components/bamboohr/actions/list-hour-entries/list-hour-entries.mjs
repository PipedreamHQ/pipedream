import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-list-hour-entries",
  name: "List Hour Entries",
  description: "List time-tracking hour entries with optional OData filtering (GET /time-tracking/hour-entries). Use returned IDs with **Delete Hour Entry**. [See the documentation](https://documentation.bamboohr.com/reference/list-hour-entries)",
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
      description: "OData filter over timesheetId, employeeId, date, e.g. `employeeId eq 100`.",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort over date, updatedAt (default `date desc`).",
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
      description: "Results per page. Min 10, max 200 (default 50).",
      min: 10,
      max: 200,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.listHourEntries({
      $,
      params: {
        "$filter": this.filter,
        "$sort": this.sort,
        "page": this.page,
        "pageSize": this.pageSize,
      },
    });
    const entries = response?.data ?? (Array.isArray(response)
      ? response
      : []);
    $.export("$summary", `Retrieved ${entries.length} hour entr${entries.length === 1
      ? "y"
      : "ies"}`);
    return response;
  },
};

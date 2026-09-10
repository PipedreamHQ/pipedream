import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-list-clock-entries",
  name: "List Clock Entries",
  description: "List time-tracking clock entries with optional OData filtering (GET /time-tracking/clock-entries). An entry with a null `end` is still open, so this action also serves to check clocked-in status (filter by employeeId and inspect `end`). Use returned IDs with **Get Clock Entry** and **Delete Clock Entry**. [See the documentation](https://documentation.bamboohr.com/reference/list-clock-entries)",
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
      description: "OData filter over timesheetId, employeeId, start, end, e.g. `employeeId eq 100`.",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort over start, end, updatedAt (default `start desc`).",
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
    const response = await this.bamboohr.listClockEntries({
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
    $.export("$summary", `Retrieved ${entries.length} clock entr${entries.length === 1
      ? "y"
      : "ies"}`);
    return response;
  },
};

import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-list-time-off-requests",
  name: "List Time Off Requests",
  description: "List time off requests within a date range (GET /time_off/requests). To fetch your own requests, set the Action parameter to `myRequests` (passing employeeId=0 returns an empty array). Use **List Time Off Types** to find type IDs. [See the documentation](https://documentation.bamboohr.com/reference/list-time-off-requests)",
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
      description: "Start of range in YYYY-MM-DD format, e.g. `2026-01-01`.",
    },
    end: {
      type: "string",
      label: "End",
      description: "End of range in YYYY-MM-DD format, e.g. `2026-01-31`.",
    },
    employeeId: {
      propDefinition: [
        bamboohr,
        "employeeId",
      ],
      description: "Filter to a specific employee ID, e.g. `12345`. Do NOT use `0` (returns empty); set the Action parameter to `myRequests` to fetch your own requests. Run **Get Employees Directory** to discover IDs.",
      optional: true,
    },
    id: {
      type: "string",
      label: "Request ID",
      description: "Filter to a specific time off request ID, e.g. `67890`. Run **List Time Off Requests** (without this filter) to discover IDs.",
      optional: true,
    },
    action: {
      type: "string",
      label: "Action",
      description: "One of `view`, `approve`, `myRequests` (default `view`).",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Comma-separated time off type IDs, e.g. `1,2`. Run **List Time Off Types** to discover IDs.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Comma-separated statuses: `approved`, `denied`, `superceded`, `requested`, `canceled`.",
      optional: true,
    },
    excludeNote: {
      type: "boolean",
      label: "Exclude Note",
      description: "When true, omit note text from results.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.listTimeOffRequests({
      $,
      params: {
        start: this.start,
        end: this.end,
        employeeId: this.employeeId,
        id: this.id,
        action: this.action,
        type: this.type,
        status: this.status,
        excludeNote: this.excludeNote,
      },
    });
    const requests = Array.isArray(response)
      ? response
      : [];
    $.export("$summary", `Found ${requests.length} time off request${requests.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};

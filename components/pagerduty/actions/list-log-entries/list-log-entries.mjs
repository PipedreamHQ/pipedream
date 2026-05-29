import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-list-log-entries",
  name: "List Log Entries",
  description:
    "List log entries (the audit trail of actions taken on an incident or across the account)."
    + " When `incidentId` is provided, scopes results to that incident's log entries."
    + " Otherwise returns account-wide log entries."
    + " Use **List Incidents** or **Get Incident** to find incident IDs."
    + " Time params use ISO 8601 with explicit UTC offset, e.g. `2026-06-02T15:00:00-07:00`."
    + " Set `isOverview: true` to get only the most recent action per incident."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/c661e065403b5-list-log-entries)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    incidentId: {
      type: "string",
      label: "Incident ID",
      description: "When provided, returns log entries for this incident only. Use **List Incidents** to find IDs. Leave empty for account-wide log entries.",
      optional: true,
    },
    since: {
      type: "string",
      label: "Since",
      description: "Start of time range (ISO 8601 with UTC offset, e.g. `2026-06-02T15:00:00-07:00`).",
      optional: true,
    },
    until: {
      type: "string",
      label: "Until",
      description: "End of time range (ISO 8601 with UTC offset).",
      optional: true,
    },
    isOverview: {
      type: "boolean",
      label: "Overview Only",
      description: "When `true`, returns only the most recent log entry for each incident.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return (1–100). Default: 25.",
      optional: true,
      default: 25,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Pagination offset. Default: 0.",
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const response = await this.app.listLogEntries({
      $,
      incidentId: this.incidentId,
      params: {
        since: this.since,
        until: this.until,
        is_overview: this.isOverview,
        limit: this.limit,
        offset: this.offset,
      },
    });

    $.export("$summary", `Found ${response.log_entries?.length ?? 0} log entries`);
    return response;
  },
};

import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-list-incidents",
  name: "List Incidents",
  description:
    "List and filter incidents by status, urgency, service, or team."
    + " Default statuses are `triggered` and `acknowledged` (open incidents)."
    + " Use **List Services** to discover service IDs and **List Teams** for team IDs."
    + " Time params use ISO 8601 with explicit UTC offset, e.g. `2026-06-02T15:00:00-07:00`."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/9d0b4b12e36f9-list-incidents)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    statuses: {
      type: "string[]",
      label: "Statuses",
      description: "Filter by status. Options: `triggered`, `acknowledged`, `resolved`. Defaults to `triggered` and `acknowledged`.",
      options: [
        "triggered",
        "acknowledged",
        "resolved",
      ],
      optional: true,
    },
    urgencies: {
      type: "string[]",
      label: "Urgencies",
      description: "Filter by urgency. Options: `high`, `low`.",
      options: [
        "high",
        "low",
      ],
      optional: true,
    },
    teamIds: {
      type: "string[]",
      label: "Team IDs",
      description: "Filter to incidents belonging to these teams.",
      optional: true,
    },
    serviceIds: {
      type: "string[]",
      label: "Service IDs",
      description: "Filter to incidents on these services. Use **List Services** to discover IDs.",
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
    const response = await this.app.listIncidents({
      $,
      params: {
        "statuses[]": this.statuses?.length
          ? this.statuses
          : [
            "triggered",
            "acknowledged",
          ],
        "urgencies[]": this.urgencies,
        "team_ids[]": this.teamIds,
        "service_ids[]": this.serviceIds,
        "since": this.since,
        "until": this.until,
        "limit": this.limit,
        "offset": this.offset,
      },
    });

    $.export("$summary", `Found ${response.incidents?.length ?? 0} incidents`);
    return response;
  },
};

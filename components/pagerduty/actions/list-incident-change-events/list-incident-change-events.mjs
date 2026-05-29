import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-list-incident-change-events",
  name: "List Incident Change Events",
  description:
    "List change events (deployments, config changes) correlated to an incident."
    + " Change events show what changed in your systems around the time the incident was triggered."
    + " Use **List Incidents** or **Get Incident** to find the incident ID."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/c7afb7de35741-list-related-change-events-for-an-incident)",
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
      description: "The ID of the incident. Use **List Incidents** or **Get Incident** to find IDs.",
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
    const response = await this.app.listIncidentChangeEvents({
      $,
      incidentId: this.incidentId,
      params: {
        limit: this.limit,
        offset: this.offset,
      },
    });

    $.export("$summary", `Found ${response.change_events?.length ?? 0} change events for incident ${this.incidentId}`);
    return response;
  },
};

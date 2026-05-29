import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-get-incident",
  name: "Get Incident",
  description:
    "Get full details for a single incident by ID, including its current status, urgency, assignments, and `html_url`."
    + " Use **List Incidents** to find the incident ID."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/005299ed43553-get-an-incident)",
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
      description: "The ID of the incident to retrieve (e.g., `P12345678`). Use **List Incidents** to find IDs.",
    },
  },
  async run({ $ }) {
    const response = await this.app.getIncident({
      $,
      incidentId: this.incidentId,
    });

    const incident = response.incident ?? response;
    $.export("$summary", `Retrieved incident ${incident.incident_number ?? this.incidentId}: "${incident.title ?? incident.summary}"`);
    return response;
  },
};

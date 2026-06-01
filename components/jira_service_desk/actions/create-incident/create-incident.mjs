import app from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-create-incident",
  name: "Create Incident",
  description:
    "Creates a new incident request in a Jira Service Desk."
    + " Auto-discovers the best-matching request type (prefers types named 'incident' or 'problem') and, if `serviceDeskId` is omitted, auto-discovers it from the user's existing requests."
    + " Use **List Sites** first to obtain the required `cloudId`."
    + " `serviceDeskId` is optional — if not provided, the tool calls **List My Requests** to discover it automatically."
    + " Returns the new request including its `issueKey` and `issueId`."
    + " [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-post)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    cloudId: {
      propDefinition: [
        app,
        "cloudId",
      ],
    },
    serviceDeskId: {
      type: "string",
      label: "Service Desk ID",
      description: "The numeric ID of the service desk (e.g. `2`). If omitted, the tool auto-discovers it from your existing requests. You can also find it in your Jira Service Management project settings.",
      optional: true,
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "The title/summary of the incident.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A detailed description of the incident. Required by most service desk configurations.",
    },
  },
  async run({ $ }) {
    // Auto-discover serviceDeskId if not provided — extract from existing requests
    let serviceDeskId = this.serviceDeskId;
    if (!serviceDeskId) {
      const existingRequests = await this.app.listMyRequests({
        $,
        cloudId: this.cloudId,
      });
      if (!existingRequests?.length) {
        throw new Error("No existing requests found to auto-discover serviceDeskId. Please provide serviceDeskId explicitly.");
      }
      const uniqueIds = [
        ...new Set(existingRequests.map((r) => r.serviceDeskId)),
      ];
      if (uniqueIds.length > 1) {
        throw new Error(
          `Multiple service desks found (${uniqueIds.join(", ")}). Please provide serviceDeskId explicitly.`,
        );
      }
      serviceDeskId = uniqueIds[0];
    }

    // Auto-discover the best-matching request type for an incident.
    // Prefers types named "incident" or "problem"; falls back to first available.
    const requestTypes = await this.app.getRequestTypes({
      $,
      cloudId: this.cloudId,
      serviceDeskId,
    });

    if (!requestTypes?.length) {
      throw new Error(`No request types found in service desk ${serviceDeskId}.`);
    }

    const INCIDENT_KEYWORDS = [
      "incident",
      "problem",
      "system problem",
      "issue",
    ];

    const incidentType = requestTypes.find(({ name }) =>
      INCIDENT_KEYWORDS.some((kw) => name?.toLowerCase().includes(kw))) || requestTypes[0];

    const requestFieldValues = {
      summary: this.summary,
      description: this.description,
    };

    const response = await this.app.createCustomerRequest({
      $,
      cloudId: this.cloudId,
      data: {
        serviceDeskId,
        requestTypeId: incidentType.id,
        requestFieldValues,
      },
    });

    $.export("$summary", `Created ${incidentType.name} ${response.issueKey}: ${this.summary}`);
    return response;
  },
};

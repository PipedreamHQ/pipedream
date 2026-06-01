import app from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-list-my-requests",
  name: "List My Requests",
  description:
    "Lists Jira Service Desk requests owned or participated in by the current user."
    + " Defaults to open requests owned by the current user."
    + " Use **List Sites** first to obtain the required `cloudId`."
    + " Each result includes `issueKey`, `issueId`, and request field values (summary, status)."
    + " `requestStatus`: `OPEN_REQUESTS` (default), `CLOSED_REQUESTS`, or `ALL_REQUESTS`."
    + " `requestOwnership`: `OWNED_REQUESTS` (default) or `PARTICIPATED_REQUESTS`."
    + " [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    cloudId: {
      type: "string",
      label: "Cloud ID",
      description: "The Atlassian cloud site ID. Use **List Sites** to retrieve available site IDs.",
    },
    serviceDeskId: {
      type: "string",
      label: "Service Desk ID",
      description: "Optional. Filter results to a specific service desk. Omit to return requests from all service desks.",
      optional: true,
    },
    requestStatus: {
      type: "string",
      label: "Request Status",
      description: "Filter by request status. `OPEN_REQUESTS` (default), `CLOSED_REQUESTS`, or `ALL_REQUESTS`.",
      options: [
        "OPEN_REQUESTS",
        "CLOSED_REQUESTS",
        "ALL_REQUESTS",
      ],
      optional: true,
    },
    requestOwnership: {
      type: "string",
      label: "Request Ownership",
      description: "Filter by ownership. `OWNED_REQUESTS` (default) returns requests created by the current user. `PARTICIPATED_REQUESTS` includes requests the user commented on.",
      options: [
        "OWNED_REQUESTS",
        "PARTICIPATED_REQUESTS",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const requests = await this.app.listMyRequests({
      $,
      cloudId: this.cloudId,
      serviceDeskId: this.serviceDeskId,
      requestStatus: this.requestStatus,
      requestOwnership: this.requestOwnership,
    });
    $.export("$summary", `Found ${requests?.length ?? 0} request(s)`);
    return requests;
  },
};

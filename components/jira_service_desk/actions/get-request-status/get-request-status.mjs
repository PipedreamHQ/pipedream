import app from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-get-request-status",
  name: "Get Request Status",
  description:
    "Returns the status history of a Jira Service Desk request — the current status plus all previous states with timestamps."
    + " Use this to understand how a request has progressed through the workflow."
    + " Use **List Sites** first to obtain the required `cloudId`."
    + " Use **List My Requests** to find the `issueKey` (e.g. `IT-42`)."
    + " [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-issueidorkey-status-get)",
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
    issueIdOrKey: {
      propDefinition: [
        app,
        "issueIdOrKey",
      ],
    },
  },
  async run({ $ }) {
    const statuses = await this.app.getRequestStatus({
      cloudId: this.cloudId,
      issueIdOrKey: this.issueIdOrKey,
    });
    const current = statuses?.[0]?.status || "unknown";
    $.export("$summary", `Status history for ${this.issueIdOrKey}: current status is "${current}" (${statuses?.length ?? 0} entries)`);
    return statuses;
  },
};

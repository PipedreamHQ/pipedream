import app from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-get-request-status",
  name: "Get Request Status",
  description:
    "Returns the status history of a Jira Service Desk request: the current status plus previous states with timestamps."
    + " The history is paginated automatically up to `maxResults`."
    + " Returns `{ statuses, truncated }`, newest first, where `truncated` is `true` when more entries remained unfetched."
    + " Use this to understand how a request has progressed through the workflow."
    + " Use **List Sites** first to obtain the required `cloudId`."
    + " Use **List My Requests** to find the `issueKey` (e.g. `IT-42`)."
    + " [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-issueidorkey-status-get)",
  version: "1.1.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    cloudId: {
      propDefinition: [
        app,
        "cloudId",
      ],
    },
    issueIdOrKey: {
      propDefinition: [
        app,
        "issueIdOrKey",
      ],
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
      label: "Max Entries",
      description: "Maximum number of status history entries to return.",
    },
  },
  async run({ $ }) {
    const {
      results: statuses, hasMore,
    } = await this.app.getRequestStatus({
      $,
      cloudId: this.cloudId,
      issueIdOrKey: this.issueIdOrKey,
      maxResults: this.maxResults,
    });
    const current = statuses?.[0]?.status || "unknown";
    $.export("$summary", `Status history for ${this.issueIdOrKey}: current status is "${current}" (${statuses.length}${hasMore
      ? "+"
      : ""} entries)`);
    return {
      statuses,
      truncated: hasMore,
    };
  },
};

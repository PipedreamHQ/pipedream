import app from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-get-request",
  name: "Get Request",
  description:
    "Fetches the full details of a Jira Service Desk request including its field values and comment thread in a single response."
    + " Comments are paginated automatically up to `maxResults`; the summary says so when the thread was truncated."
    + " Use this to summarize a ticket without needing follow-up calls."
    + " Use **List Sites** first to obtain the required `cloudId`."
    + " Use **List My Requests** to find the `issueKey` of a request (e.g. `IT-42`)."
    + " [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-issueidorkey-get)",
  version: "0.2.4",
  type: "action",
  ai: "optimized",
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
      label: "Max Comments",
      description: "Maximum number of comments to return across all pages (1-1000).",
    },
  },
  async run({ $ }) {
    const [
      request,
      {
        results: comments, hasMore,
      },
    ] = await Promise.all([
      this.app.getRequest({
        $,
        cloudId: this.cloudId,
        issueIdOrKey: this.issueIdOrKey,
      }),
      this.app.getRequestComments({
        $,
        cloudId: this.cloudId,
        issueIdOrKey: this.issueIdOrKey,
        maxResults: this.maxResults,
      }),
    ]);

    const summary = request.requestFieldValues?.find?.(({ fieldId }) => fieldId === "summary")?.value
      || this.issueIdOrKey;

    $.export("$summary", `Request ${request.issueKey}: ${summary} (${comments.length}${hasMore
      ? "+"
      : ""} comment(s))`);
    return {
      ...request,
      comments,
      commentsTruncated: hasMore,
    };
  },
};

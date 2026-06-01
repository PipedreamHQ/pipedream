import app from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-get-request",
  name: "Get Request",
  description:
    "Fetches the full details of a Jira Service Desk request including its field values and complete comment thread in a single response."
    + " Use this to summarize a ticket without needing follow-up calls."
    + " Use **List Sites** first to obtain the required `cloudId`."
    + " Use **List My Requests** to find the `issueKey` of a request (e.g. `IT-42`)."
    + " [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-issueidorkey-get)",
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
    const [
      request,
      comments,
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
      }),
    ]);

    const summary = request.requestFieldValues?.find?.(({ fieldId }) => fieldId === "summary")?.value
      || this.issueIdOrKey;

    $.export("$summary", `Request ${request.issueKey}: ${summary} (${comments?.length ?? 0} comment(s))`);
    return {
      ...request,
      comments,
    };
  },
};

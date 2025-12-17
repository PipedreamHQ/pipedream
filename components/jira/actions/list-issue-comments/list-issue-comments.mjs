import jira from "../../jira.app.mjs";

export default {
  key: "jira-list-issue-comments",
  name: "List Issue Comments",
  description: "Lists all comments for an issue. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/#api-rest-api-3-issue-issueidorkey-comment-get)",
  version: "0.1.15",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    jira,
    cloudId: {
      propDefinition: [
        jira,
        "cloudId",
      ],
    },
    issueIdOrKey: {
      propDefinition: [
        jira,
        "issueIdOrKey",
        (c) => ({
          cloudId: c.cloudId,
        }),
      ],
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "[Order](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#ordering) the results by a field. Accepts *created* to sort comments by their created date.\nValid values: `created`, `-created`, `+created`.",
      optional: true,
      options: [
        "created",
        "+created",
        "-created",
      ],
    },
    expand: {
      propDefinition: [
        jira,
        "expand",
      ],
      description: "Use expand to include additional information about comments in the response. This parameter accepts `renderedBody`, which returns the comment body rendered in HTML.",
    },
  },
  async run({ $ }) {
    const issueComments = [];
    const resourcesStream = await this.jira.getResourcesStream({
      cloudId: this.cloudId,
      resourceFn: this.jira.listIssueComments,
      resourceFnArgs: {
        $,
        issueIdOrKey: this.issueIdOrKey,
        params: {
          orderBy: this.orderBy,
          expand: this.expand,
        },
      },
      resourceFiltererFn: (resource) => resource.comments,
    });
    for await (const issueComment of resourcesStream) {
      issueComments.push(issueComment);
    }
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully fetched issue ${issueComments.length} ${issueComments.length === 1 ? "comment" : "comments"}`);
    return issueComments;
  },
};

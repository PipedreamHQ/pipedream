import jira from "../../jira.app.mjs";

export default {
  key: "jira-list-issue-comments",
  name: "List Issue Comments",
  description: "Lists all comments for an issue, [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/#api-rest-api-3-issue-issueidorkey-comment-get)",
  version: "0.1.2",
  type: "action",
  props: {
    jira,
    issueIdOrKey: {
      propDefinition: [
        jira,
        "issueIdOrKey",
      ],
    },
    startAt: {
      type: "integer",
      label: "Start at",
      description: "The index of the first item to return in a page of results (page offset).\nDefault: `0`, Format: `int64`.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max results",
      description: "The maximum number of items to return per page.\nDefault: `50`, Format: `int32`.",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order by",
      description: "[Order](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#ordering) the results by a field. Accepts *created* to sort comments by their created date.\nValid values: `created`, `-created`, `+created`.",
      optional: true,
      options: [
        "created",
        "+created",
        "-created",
      ],
    },
    expand: {
      type: "string",
      label: "Expand",
      description: "Use expand to include additional information about comments in the response. This parameter accepts `renderedBody`, which returns the comment body rendered in HTML.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.jira.listIssueComments({
      $,
      issueIdOrKey: this.issueIdOrKey,
      params: {
        startAt: this.startAt,
        maxResults: this.maxResults,
        orderBy: this.orderBy,
        expand: this.expand,
      },
    });
    $.export("$summary", `Successfully retrieved list of comments for the issue with ID(or key): ${this.issueIdOrKey}`);
    return response;
  },
};

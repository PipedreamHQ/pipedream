import base from "../common/base.mjs";
import constants from "../common/constants.mjs";

const { jira } = base.props;

export default {
  ...base,
  key: "jira-get-issue-comments",
  name: "Get Issue Comments",
  description: "Lists all comments for an issue. [See docs here](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/#api-rest-api-3-issue-issueidorkey-comment-get)",
  version: "0.1.1",
  type: "action",
  props: {
    ...base.props,
    issueId: {
      propDefinition: [
        jira,
        "issueId",
        (c) => ({
          cloudId: c.cloudId,
        }),
      ],
    },
    startAt: {
      label: "Start At",
      description: "The index of the first item to return in a page of results (page offset).\nDefault: `0`, Format: `int64`.",
      type: "integer",
      optional: true,
    },
    maxResults: {
      label: "Max Results",
      description: "The maximum number of items to return per page.\nDefault: `50`, Format: `int32`.",
      type: "integer",
      optional: true,
    },
    orderBy: {
      label: "Order By",
      description: "[Order](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#ordering) the results by a field. Accepts *created* to sort comments by their created date.\nValid values: `created`, `-created`, `+created`.",
      type: "string",
      optional: true,
      options: constants.ORDER_BY_OPTIONS,
    },
    expand: {
      propDefinition: [
        jira,
        "expand",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.jira.getIssue({
      $,
      cloudId: this.cloudId,
      issueId: this.issueId,
      params: {
        startAt: parseInt(this.startAt),
        maxResults: parseInt(this.maxResults),
        orderBy: this.orderBy,
        expand: this.expand,
      },
    });

    $.export("$summary", "Successfully retrieved issues comments");

    return response;
  },
};

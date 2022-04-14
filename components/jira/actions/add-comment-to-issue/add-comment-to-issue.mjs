import jira from "../../jira.app.mjs";

export default {
  key: "jira-add-comment-to-issue",
  name: "Add Comment To Issue",
  description: "Adds a new comment to an issue, [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/#api-rest-api-3-issue-issueidorkey-comment-post)",
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
    body: {
      type: "object",
      label: "Body",
      description: "The comment text in [Atlassian Document Format](https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/).",
    },
    visibility: {
      type: "object",
      label: "Visibility",
      description: "The group or role to which this comment is visible, See `Visibility` section of [doc](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/#api-rest-api-3-issue-issueidorkey-comment-post)",
      optional: true,
    },
    properties: {
      type: "any",
      label: "Properties",
      description: "A list of comment properties.",
      optional: true,
    },
    additionalProperties: {
      type: "string",
      label: "Additional properties",
      description: "Extra properties of any type may be provided to this object.",
      optional: true,
    },
    expand: {
      type: "string",
      label: "Expand",
      description: "The Jira REST API uses resource expansion, which means that some parts of a resource are not returned unless specified in the request. This parameter accepts `renderedBody`, which returns the comment body rendered in HTML.",
      optional: true,
    },
  },
  async run({ $ }) {
    const visibility = this.jira.parseObject(this.visibility);
    const body = this.jira.parseObject(this.body);
    const properties = this.properties ?
      JSON.parse(this.properties) :
      undefined;

    const response = await this.jira.addCommentToIssue({
      $,
      issueIdOrKey: this.issueIdOrKey,
      params: {
        expand: this.expand,
      },
      data: {
        body,
        visibility,
        properties,
        ...this.additionalProperties,
      },
    });
    $.export("$summary", `Comment has been added to the issue with ID(or key): ${this.issueIdOrKey}`);
    return response;

  },
};

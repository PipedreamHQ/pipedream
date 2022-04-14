import jira from "../../jira.app.mjs";

export default {
  key: "jira-update-comment",
  name: "Update Comment",
  description: "Updates a comment, [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/#api-rest-api-3-issue-issueidorkey-comment-id-put)",
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
    commentId: {
      type: "string",
      label: "Comment ID",
      description: "The ID of the comment.",
    },
    body: {
      type: "object",
      label: "Body",
      description: "The comment text in [Atlassian Document Format](https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/).",
    },
    visibility: {
      type: "object",
      label: "Visibility",
      description: "The group or role to which this comment is visible, See `Visibility` section of [doc](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/#api-rest-api-3-issue-issueidorkey-comment-id-put)",
      optional: true,
    },
    properties: {
      type: "string",
      label: "Properties",
      description: "Details of issue properties to be add or update, please provide an array of objects with keys and values.",
      optional: true,
    },
    additionalProperties: {
      type: "string",
      label: "Additional Properties",
      description: "Extra properties of any type may be provided to this object.",
      optional: true,
    },
    notifyUsers: {
      type: "boolean",
      label: "Notify users",
      description: "Whether users are notified when a comment is updated.",
      optional: true,
    },
    expand: {
      type: "string",
      label: "Expand",
      description: "Use expand to include additional information about comments in the response. This parameter accepts `renderedBody`, which returns the comment body rendered in HTML.",
      optional: true,
    },
  },
  async run({ $ }) {
    const body = this.jira.parseObject(this.body);
    const visibility = this.jira.parseObject(this.visibility);
    const additionalProperties = this.jira.parseObject(this.additionalProperties);
    const properties = this.properties ?
      JSON.parse(this.properties) :
      undefined;
    const response = await this.jira.updateComment({
      $,
      issueIdOrKey: this.issueIdOrKey,
      commentId: this.commentId,
      params: {
        notifyUsers: this.notifyUsers,
        expand: this.expand,
      },
      data: {
        body,
        visibility,
        properties,
        ...additionalProperties,
      },
    });
    $.export("$summary", `Comment with ID: ${this.commentId} has been updated for the issue with ID(or key): ${this.issueIdOrKey}`);
    return response;
  },
};

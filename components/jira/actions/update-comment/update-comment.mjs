import utils from "../../common/utils.mjs";
import common from "../common/issue.mjs";
import { ConfigurationError } from "@pipedream/platform";
import jira from "../../jira.app.mjs";

export default {
  key: "jira-update-comment",
  name: "Update Comment",
  description: "Updates a comment. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/#api-rest-api-3-issue-issueidorkey-comment-id-put)",
  version: "0.1.16",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    commentId: {
      propDefinition: [
        jira,
        "commentId",
        (c) => ({
          cloudId: c.cloudId,
          issueIdOrKey: c.issueIdOrKey,
        }),
      ],
    },
    body: {
      type: "object",
      label: "Body",
      description: "The comment text in [Atlassian Document Format](https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/), e.g. `{\"type\":\"doc\",\"version\":1,\"content\":[{\"content\":[{\"text\":\"This is a comment\",\"type\":\"text\"}],\"type\":\"paragraph\"}]}`. Will overwrite comment if both comment and body are provided",
      optional: true,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "The comment text",
      optional: true,
    },
    visibility: {
      type: "object",
      label: "Visibility",
      description: "The group or role to which this comment is visible, See `Visibility` section of [doc](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/#api-rest-api-3-issue-issueidorkey-comment-id-put)",
      optional: true,
    },
    properties: {
      propDefinition: [
        jira,
        "properties",
      ],
      description: "Details of issue properties to be added or updated. Please provide an array of objects with keys and values.",
    },
    additionalProperties: {
      propDefinition: [
        jira,
        "additionalProperties",
      ],
    },
    notifyUsers: {
      type: "boolean",
      label: "Notify Users",
      description: "Whether users are notified when a comment is updated",
      optional: true,
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
    if (!this.comment && !this.body) {
      throw new ConfigurationError("Either comment or body is required");
    }

    const body = this.body
      ? utils.parseObject(this.body)
      : this.comment
        ? common.methods.atlassianDocumentFormat(this.comment)
        : undefined;

    const visibility = utils.parseObject(this.visibility);
    const additionalProperties = utils.parseObject(this.additionalProperties);
    let properties;
    try {
      properties = JSON.parse(this.properties);
    } catch ( err ) {
      //pass
    }
    const response = await this.jira.updateComment({
      $,
      cloudId: this.cloudId,
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

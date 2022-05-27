import base from "../common/base.mjs";
import utils from "../common/utils.mjs";

const { jira } = base.props;

export default {
  ...base,
  key: "jira-update-comment",
  name: "Update Comment",
  description: "Updates a comment. [See docs here](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/#api-rest-api-3-issue-issueidorkey-comment-id-put)",
  version: "0.2.0",
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
    commentId: {
      propDefinition: [
        jira,
        "commentId",
        (c) => ({
          cloudId: c.cloudId,
          issueId: c.issueId,
        }),
      ],
    },
    expand: {
      propDefinition: [
        jira,
        "expand",
      ],
    },
    body: {
      label: "Body",
      description: "The comment text in [Atlassian Document Format](https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/).",
      type: "object",
    },
    visibilityType: {
      propDefinition: [
        jira,
        "visibilityType",
      ],
    },
    visibilityValue: {
      propDefinition: [
        jira,
        "visibilityType",
      ],
    },
    visibilityAdditionalProperties: {
      propDefinition: [
        jira,
        "visibilityType",
      ],
    },
    properties: {
      propDefinition: [
        jira,
        "visibilityType",
      ],
    },
    additionalProperties: {
      propDefinition: [
        jira,
        "visibilityType",
      ],
    },
  },
  async run({ $ }) {
    const parsedProperties = utils.parseStringToJSON(this.properties);
    const parsedBody = utils.parseStringToJSON(this.body);
    const parsedVisibilityAdditionalProperties = utils.parseStringToJSON(
      this.visibilityAdditionalProperties,
    );

    const response = await this.jira.updateIssueComment({
      $,
      cloudId: this.cloudId,
      issueId: this.issueId,
      commentId: this.commentId,
      params: {
        expand: this.expand,
      },
      data: {
        body: parsedBody,
        visibility: {
          type: this.visibilityType,
          value: this.visibilityValue,
          additional_properties: parsedVisibilityAdditionalProperties,
        },
        properties: parsedProperties,
        additional_properties: this.additionalProperties,
      },
    });

    $.export("$summary", "Successfully updated comment to issue");

    return response;
  },
};

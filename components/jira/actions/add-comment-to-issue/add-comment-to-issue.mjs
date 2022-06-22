import base from "../common/base.mjs";
import utils from "../common/utils.mjs";

const { jira } = base.props;

export default {
  ...base,
  key: "jira-add-comment-to-issue",
  name: "Add Comment To Issue",
  description: "Adds a new comment to an issue. [See docs here]()",
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
    body: {
      label: "Body",
      description: "The comment text in [Atlassian Document Format](https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/).",
      type: "string",
    },
    expand: {
      propDefinition: [
        jira,
        "expand",
      ],
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

    const response = await this.jira.createIssueComment({
      $,
      cloudId: this.cloudId,
      issueId: this.issueId,
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

    $.export("$summary", "Successfully added comment to issue");

    return response;
  },
};

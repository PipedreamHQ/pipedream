import base from "../common/base.mjs";
import constants from "../common/constants.mjs";
import utils from "../common/utils.mjs";

const { jira } = base.props;

export default {
  ...base,
  key: "jira-add-comment-to-issue",
  name: "Add Comment To Issue",
  description: "Adds a new comment to an issue. [See docs here]()",
  version: "0.1.1",
  type: "action",
  props: {
    ...base.props,
    issueId: {
      propDefinition: [
        jira,
        "issueId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    body: {
      label: "Body",
      description: "The comment text in [Atlassian Document Format](https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/).",
      type: "string",
    },
    expand: {
      label: "Expand",
      description: "The Jira REST API uses resource expansion, which means that some parts of a resource are not returned unless specified in the request. Use [expand](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#expansion) to include additional information about comments in the response. This parameter accepts `renderedBody`, which returns the comment body rendered in HTML.",
      type: "object",
      optional: true,
    },
    visibilityType: {
      label: "Visibility Type",
      type: "string",
      description: "Whether visibility of this item is restricted to a group or role.",
      optional: true,
      options: constants.VISIBILITY_TYPES,
    },
    visibilityValue: {
      label: "Visibility Value",
      description: "The name of the group or role to which visibility of this item is restricted.",
      type: "string",
      optional: true,
    },
    visibilityAdditionalProperties: {
      label: "Visibility Additional Properties",
      description: "Extra properties of any type may be provided to the visibility object.",
      type: "string",
      optional: true,
    },
    properties: {
      label: "Properties",
      description: "A list of comment properties.",
      type: "string[]",
      optional: true,
    },
    additionalProperties: {
      label: "Additional Properties",
      description: "Extra properties of any type may be provided to this object.",
      type: "string",
      optional: true,
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
      projectId: this.projectId,
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

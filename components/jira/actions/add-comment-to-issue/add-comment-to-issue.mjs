import utils from "../../common/utils.mjs";
import jira from "../../jira.app.mjs";

export default {
  key: "jira-add-comment-to-issue",
  name: "Add Comment To Issue",
  description: "Adds a new comment to an issue, [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/#api-rest-api-3-issue-issueidorkey-comment-post)",
  version: "0.1.13",
  annotations: {
    destructiveHint: false,
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
    body: {
      type: "object",
      label: "Body",
      description: "The comment text in [Atlassian Document Format](https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/), e.g. `{\"type\":\"doc\",\"version\":1,\"content\":[{\"content\":[{\"text\":\"This is a comment\",\"type\":\"text\"}],\"type\":\"paragraph\"}]}`",
    },
    visibility: {
      type: "object",
      label: "Visibility",
      description: "The group or role to which this comment is visible, See `Visibility` section of [doc](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/#api-rest-api-3-issue-issueidorkey-comment-post)",
      optional: true,
    },
    properties: {
      propDefinition: [
        jira,
        "properties",
      ],
      description: "A list of comment properties.",
    },
    additionalProperties: {
      propDefinition: [
        jira,
        "additionalProperties",
      ],
    },
    expand: {
      propDefinition: [
        jira,
        "expand",
      ],
      description: "The Jira REST API uses resource expansion, which means that some parts of a resource are not returned unless specified in the request. This parameter accepts `renderedBody`, which returns the comment body rendered in HTML.",
    },
  },
  async run({ $ }) {
    const visibility = utils.parseObject(this.visibility);
    const body = utils.parseObject(this.body);
    const additionalProperties = utils.parseObject(this.additionalProperties);
    let properties;
    try {
      properties = JSON.parse(this.properties);
    } catch ( err ) {
      //pass
    }
    const response = await this.jira.addCommentToIssue({
      $,
      cloudId: this.cloudId,
      issueIdOrKey: this.issueIdOrKey,
      params: {
        expand: this.expand,
      },
      data: {
        body,
        visibility,
        properties,
        ...additionalProperties,
      },
    });
    $.export("$summary", `Comment has been added to the issue with ID(or key): ${this.issueIdOrKey}`);
    return response;

  },
};

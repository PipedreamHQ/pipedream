// legacy_hash_id: a_YEikxJ
import { axios } from "@pipedream/platform";

export default {
  key: "jira-update-comment",
  name: "Update Comment",
  description: "Updates a comment.",
  version: "0.1.1",
  type: "action",
  props: {
    jira: {
      type: "app",
      app: "jira",
    },
    issueIdOrKey: {
      type: "string",
      description: "The ID or key of the issue where the comment will be added.",
    },
    comment_id: {
      type: "string",
    },
    expand: {
      type: "object",
      description: "The Jira REST API uses resource expansion, which means that some parts of a resource are not returned unless specified in the request. Use [expand](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#expansion) to include additional information about comments in the response. This parameter accepts `renderedBody`, which returns the comment body rendered in HTML.",
      optional: true,
    },
    body: {
      type: "object",
      description: "The comment text in [Atlassian Document Format](https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/).",
    },
    visibility_type: {
      type: "string",
      description: "Whether visibility of this item is restricted to a group or role.",
      optional: true,
      options: [
        "group",
        "role",
      ],
    },
    visibility_value: {
      type: "string",
      description: "The name of the group or role to which visibility of this item is restricted.",
      optional: true,
    },
    visibility_additional_properties: {
      type: "object",
      description: "Extra properties of any type may be provided to the visibility object.",
      optional: true,
    },
    properties: {
      type: "any",
      description: "A list of comment properties.",
      optional: true,
    },
    additional_properties: {
      type: "string",
      description: "Extra properties of any type may be provided to this object.",
      optional: true,
    },
  },
  async run({ $ }) {
  // First we must make a request to get our the cloud instance ID tied
  // to our connected account, which allows us to construct the correct REST API URL. See Section 3.2 of
  // https://developer.atlassian.com/cloud/jira/platform/oauth-2-authorization-code-grants-3lo-for-apps/
    const resp = await axios($, {
      url: "https://api.atlassian.com/oauth/token/accessible-resources",
      headers: {
        Authorization: `Bearer ${this.jira.$auth.oauth_access_token}`,
      },
    });

    // Assumes the access token has access to a single instance
    const cloudId = resp[0].id;

    // See https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/#api-rest-api-3-issue-issueidorkey-comment-id-put
    // for all options
    return await axios($, {
      method: "put",
      url: `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${this.issueIdOrKey}/comment/${this.comment_id}`,
      headers: {
        "Authorization": `Bearer ${this.jira.$auth.oauth_access_token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      params: {
        expand: this.expand,
      },
      data: {
        body: this.body,
        visibility: {
          type: this.visibility_type,
          value: this.visibility_value,
          additional_properties: this.visibility_additional_properties,
        },
        properties: this.properties,
        additional_properties: this.additional_properties,
      },
    });
  },
};

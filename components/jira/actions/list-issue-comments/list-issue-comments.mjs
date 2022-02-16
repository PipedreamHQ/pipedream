// legacy_hash_id: a_NqilRo
import { axios } from "@pipedream/platform";

export default {
  key: "jira-list-issue-comments",
  name: "List Issue Comments",
  description: "Lists all comments for an issue.",
  version: "0.1.1",
  type: "action",
  props: {
    jira: {
      type: "app",
      app: "jira",
    },
    issueIdOrKey: {
      type: "string",
      description: "The ID or key of the issue to get comments of.",
    },
    startAt: {
      type: "integer",
      description: "The index of the first item to return in a page of results (page offset).\nDefault: `0`, Format: `int64`.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      description: "The maximum number of items to return per page.\nDefault: `50`, Format: `int32`.",
      optional: true,
    },
    orderBy: {
      type: "string",
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
      description: "Use [expand](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#expansion) to include additional information about transitions in the response. This parameter accepts `renderedBody`, which returns the comment body rendered in HTML.",
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

    // See https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/#api-rest-api-3-issue-issueidorkey-comment-get
    // for all options
    return await axios($, {
      url: `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${this.issueIdOrKey}/comment`,
      headers: {
        "Authorization": `Bearer ${this.jira.$auth.oauth_access_token}`,
        "Accept": "application/json",
      },
      params: {
        startAt: parseInt(this.startAt),
        maxResults: parseInt(this.maxResults),
        orderBy: this.orderBy,
        expand: this.expand,
      },
    });
  },
};

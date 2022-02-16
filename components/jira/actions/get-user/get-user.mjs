// legacy_hash_id: a_EVixVA
import { axios } from "@pipedream/platform";

export default {
  key: "jira-get-user",
  name: "Get User",
  description: "Gets details of user.",
  version: "0.1.1",
  type: "action",
  props: {
    jira: {
      type: "app",
      app: "jira",
    },
    accountId: {
      type: "string",
      description: "The account ID of the user, which uniquely identifies the user across all Atlassian products. For example, *5b10ac8d82e05b22cc7d4ef5*.",
    },
    expand: {
      type: "string",
      description: "Use [expand](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#expansion) to include additional information about users in the response. This parameter accepts a comma-separated list. Expand options include:\n* `groups` includes all groups and nested groups to which the user belongs.\n* `applicationRoles` includes details of all the applications to which the user has access.",
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

    // See https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-users/#api-rest-api-3-user-get
    // for all options

    if (!this.accountId) {
      throw new Error("Must provide accountId parameter.");
    }

    return await axios($, {
      url: `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/user`,
      headers: {
        "Authorization": `Bearer ${this.jira.$auth.oauth_access_token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      params: {
        accountId: this.accountId,
        expand: this.expand,
      },
    });
  },
};

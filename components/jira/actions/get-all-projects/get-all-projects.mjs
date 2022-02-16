// legacy_hash_id: a_poimkX
import { axios } from "@pipedream/platform";

export default {
  key: "jira-get-all-projects",
  name: "JIRA - Get All Projects",
  description: "Gets metadata on all projects. See https://developer.atlassian.com/cloud/jira/platform/rest/v3/#api-rest-api-3-project-get",
  version: "0.1.1",
  type: "action",
  props: {
    jira: {
      type: "app",
      app: "jira",
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
    const cloudID = resp[0].id;

    return await axios($, {
      method: "GET",
      url: `https://api.atlassian.com/ex/jira/${cloudID}/rest/api/3/project`,
      headers: {
        "Authorization": `Bearer ${this.jira.$auth.oauth_access_token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });
  },
};

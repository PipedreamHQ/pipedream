// legacy_hash_id: a_YEiwPB
import { axios } from "@pipedream/platform";

export default {
  key: "jira-create-issue",
  name: "JIRA - Create Issue",
  description: "Creates a new issue. See https://developer.atlassian.com/cloud/jira/platform/rest/v3/#api-rest-api-3-issue-post",
  version: "0.1.1",
  type: "action",
  props: {
    jira: {
      type: "app",
      app: "jira",
    },
    summary: {
      type: "string",
      label: "Issue Summary",
      description: "The title of the issue",
    },
    issuetype: {
      type: "string",
      label: "Issue Type",
      description: "An ID identifying the type of issue you'd like to create. See the API docs at https://developer.atlassian.com/cloud/jira/platform/rest/v3/#api-rest-api-3-issue-post to see available options",
      optional: true,
    },
    projectID: {
      type: "string",
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

    // See https://developer.atlassian.com/cloud/jira/platform/rest/v3/#api-rest-api-3-issue-post
    // for all options
    return await axios($, {
      method: "POST",
      url: `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/`,
      headers: {
        "Authorization": `Bearer ${this.jira.$auth.oauth_access_token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      data: {
        fields: {
          summary: this.summary,
          issuetype: {
            id: this.issuetype,
          },
          project: {
            id: this.projectID,
          },
        },
      },
    });
  },
};

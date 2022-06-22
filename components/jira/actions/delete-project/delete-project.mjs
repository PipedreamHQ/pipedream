// legacy_hash_id: a_Mdie4R
import { axios } from "@pipedream/platform";

export default {
  key: "jira-delete-project",
  name: "Delete Project",
  description: "Deletes a project.",
  version: "0.1.1",
  type: "action",
  props: {
    jira: {
      type: "app",
      app: "jira",
    },
    projectIdOrKey: {
      type: "string",
      description: "The project ID or project key (case sensitive) to delete.",
    },
    enableUndo: {
      type: "boolean",
      description: "EXPERIMENTAL parameter. Whether this project is placed in the Jira recycle bin where it will be available for restoration.",
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

    // See https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-projects/#api-rest-api-3-project-projectidorkey-delete
    // for all options
    return await axios($, {
      method: "delete",
      url: `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/project/${this.projectIdOrKey}`,
      headers: {
        "Authorization": `Bearer ${this.jira.$auth.oauth_access_token}`,
        "Accept": "application/json",
      },
      params: {
        enableUndo: this.enableUndo,
      },
    });
  },
};

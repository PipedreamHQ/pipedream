// legacy_hash_id: a_jQi6PQ
import { axios } from "@pipedream/platform";

export default {
  key: "jira-get-task",
  name: "Get Task",
  description: "Gets the status of a long-running asynchronous task.",
  version: "0.1.1",
  type: "action",
  props: {
    jira: {
      type: "app",
      app: "jira",
    },
    task_id: {
      type: "string",
      description: "The ID of the task to get details of. A task is a resource that represents a [long-running asynchronous tasks](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#async-operations).",
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

    // See https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-tasks/#api-rest-api-3-task-taskid-get
    // for all options
    return await axios($, {
      url: `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/task/${this.task_id}`,
      headers: {
        "Authorization": `Bearer ${this.jira.$auth.oauth_access_token}`,
        "Accept": "application/json",
      },
    });
  },
};

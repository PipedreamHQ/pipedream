// legacy_hash_id: a_MdizXv
import { axios } from "@pipedream/platform";

export default {
  key: "jira-create-version",
  name: "Create Jira Version in project",
  version: "0.1.1",
  type: "action",
  props: {
    jira: {
      type: "app",
      app: "jira",
    },
    cloudId: {
      type: "string",
      description: "Could add previous step as `jira.obtain_jira_instance_id` and use its return value like `{{steps.obtain_jira_instance_id.$return_value}}`",
    },
    project: {
      type: "string",
    },
    version: {
      type: "string",
    },
  },
  async run({ $ }) {
    return await axios($, {
      method: "POST",
      url: `https://api.atlassian.com/ex/jira/${this.cloudId}/rest/api/3/version`,
      headers: {
        "Authorization": `Bearer ${this.jira.$auth.oauth_access_token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      data: {
        project: this.project,
        name: this.version,
      },
    });
  },
};

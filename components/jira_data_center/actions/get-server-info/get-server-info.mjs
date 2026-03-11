import jiraDataCenter from "../../jira_data_center.app.mjs";

export default {
  key: "jira_data_center-get-server-info",
  name: "Get Server Info",
  description: "Returns general information about the Jira Data Center instance, including version, base URL, and deployment type. [See the documentation](https://developer.atlassian.com/server/jira/platform/rest/v11003/api-group-serverinfo/#api-api-2-serverinfo-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    jiraDataCenter,
  },
  async run({ $ }) {
    const response = await this.jiraDataCenter.getServerInfo({
      $,
    });
    $.export("$summary", `Successfully retrieved server info for ${response.baseUrl ?? "Jira Data Center"}`);
    return response;
  },
};

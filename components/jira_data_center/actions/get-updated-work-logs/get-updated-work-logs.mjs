import jiraDataCenter from "../../jira_data_center.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  name: "Get Updated Work Logs",
  description: "Gets the updated work logs for a given time period. [See the documentation](https://developer.atlassian.com/server/jira/platform/rest/v10002/api-group-worklog/#api-api-2-worklog-updated-get)",
  key: "jira_data_center-get-updated-work-logs",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    jiraDataCenter,
    since: {
      type: "string",
      label: "Since",
      description: "The date and time to start the search from. Format: `YYYY-MM-DDTHH:MM:SS.SSSZ`",
    },
  },
  async run({ $ }) {
    const since = Date.parse(this.since);
    if (isNaN(since)) {
      throw new ConfigurationError("Invalid date format. Please use the format `YYYY-MM-DDTHH:MM:SS.SSSZ`");
    }
    const response = await this.jiraDataCenter.getUpdatedWorkLogs({
      $,
      params: {
        since,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.values?.length || 0} updated work logs`);
    return response;
  },
};

import jiraDataCenter from "../../jira_data_center.app.mjs";

export default {
  key: "jira_data_center-get-worklogs-by-id",
  name: "Get Worklogs by ID",
  description: "Gets the worklogs by IDs. [See the documentation](https://developer.atlassian.com/server/jira/platform/rest/v10002/api-group-worklog/#api-api-2-worklog-list-post)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    jiraDataCenter,
    worklogIds: {
      propDefinition: [
        jiraDataCenter,
        "worklogIds",
      ],
    },
  },
  async run({ $ }) {
    const worklogIds = typeof this.worklogIds === "string"
      ? this.worklogIds.split(",")
      : this.worklogIds;
    const response = await this.jiraDataCenter.listWorklogsById({
      $,
      data: {
        ids: worklogIds,
      },
    });
    $.export("$summary", `Successfully retrieved ${response?.length || 0} worklogs`);
    return response;
  },
};

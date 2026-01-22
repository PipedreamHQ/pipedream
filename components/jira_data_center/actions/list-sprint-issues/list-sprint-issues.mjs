import jiraDataCenter from "../../jira_data_center.app.mjs";

export default {
  name: "List Sprint Issues",
  description: "Lists the issues for a given sprint. [See the documentation](https://developer.atlassian.com/server/jira/platform/rest/v10002/api-group-sprint/#api-agile-1-0-sprint-sprintid-issue-get)",
  key: "jira_data_center-list-sprint-issues",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    jiraDataCenter,
    boardId: {
      propDefinition: [
        jiraDataCenter,
        "boardId",
      ],
    },
    sprintId: {
      propDefinition: [
        jiraDataCenter,
        "sprintId",
        (c) => ({
          boardId: c.boardId,
        }),
      ],
    },
    jql: {
      propDefinition: [
        jiraDataCenter,
        "jql",
      ],
      optional: true,
    },
    maxResults: {
      propDefinition: [
        jiraDataCenter,
        "maxResults",
      ],
    },
    startAt: {
      propDefinition: [
        jiraDataCenter,
        "startAt",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.jiraDataCenter.listSprintIssues({
      $,
      sprintId: this.sprintId,
      params: {
        jql: this.jql,
        maxResults: this.maxResults,
        startAt: this.startAt,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.issues?.length || 0} issues`);
    return response;
  },
};

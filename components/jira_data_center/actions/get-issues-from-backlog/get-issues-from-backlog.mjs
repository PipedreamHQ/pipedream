import jiraDataCenter from "../../jira_data_center.app.mjs";

export default {
  name: "Get Issues From Backlog",
  description: "Gets the issues from the backlog. [See the documentation](https://developer.atlassian.com/server/jira/platform/rest/v10002/api-group-board/#api-agile-1-0-board-boardid-backlog-get)",
  key: "jira_data_center-get-issues-from-backlog",
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
    const response = await this.jiraDataCenter.getIssuesFromBacklog({
      $,
      boardId: this.boardId,
      params: {
        jql: this.jql,
        maxResults: this.maxResults,
        startAt: this.startAt,
      },
    });
    $.export("$summary", `Successfully got ${response.issues.length} issues from backlog for board with ID \`${this.boardId}\``);
    return response;
  },
};

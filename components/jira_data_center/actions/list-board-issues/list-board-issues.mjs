import jiraDataCenter from "../../jira_data_center.app.mjs";

export default {
  name: "List Board Issues",
  description: "Lists the issues for a given board. [See the documentation](https://developer.atlassian.com/server/jira/platform/rest/v10002/api-group-board/#api-agile-1-0-board-boardid-issue-get)",
  key: "jira_data_center-list-board-issues",
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
    const response = await this.jiraDataCenter.listBoardIssues({
      $,
      boardId: this.boardId,
      params: {
        jql: this.jql,
        maxResults: this.maxResults,
        startAt: this.startAt,
      },
    });
    $.export("$summary", `Successfully got ${response.issues.length} issues for board with ID \`${this.boardId}\``);
    return response;
  },
};

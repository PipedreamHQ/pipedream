import jiraDataCenter from "../../jira_data_center.app.mjs";

export default {
  name: "Move Issues To Backlog",
  description: "Moves issues to the backlog. [See the documentation](https://developer.atlassian.com/server/jira/platform/rest/v10002/api-group-backlog/#api-agile-1-0-backlog-issue-post)",
  key: "jira_data_center-move-issues-to-backlog",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    jiraDataCenter,
    boardId: {
      propDefinition: [
        jiraDataCenter,
        "boardId",
      ],
    },
    issueIds: {
      propDefinition: [
        jiraDataCenter,
        "issueId",
        (c) => ({
          boardId: c.boardId,
        }),
      ],
      type: "string[]",
      label: "Issue IDs",
      description: "The IDs of the issues to move",
    },
  },
  async run({ $ }) {
    const response = await this.jiraDataCenter.moveIssuesToBacklog({
      $,
      boardId: this.boardId,
      data: {
        issues: this.issueIds,
      },
    });
    $.export("$summary", `Successfully moved ${this.issueIds.length} issues to backlog for board with ID \`${this.boardId}\``);
    return response;
  },
};

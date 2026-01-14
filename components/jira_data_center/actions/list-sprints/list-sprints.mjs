import jiraDataCenter from "../../jira_data_center.app.mjs";

export default {
  name: "List Sprints",
  description: "Lists the sprints for a given board. [See the documentation](https://developer.atlassian.com/server/jira/platform/rest/v10002/api-group-board/#api-agile-1-0-board-boardid-sprint-get)",
  key: "jira_data_center-list-sprints",
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
  },
  async run({ $ }) {
    const response = await this.jiraDataCenter.listSprints({
      $,
      boardId: this.boardId,
    });
    $.export("$summary", `Successfully fetched ${response.values?.length || 0} sprints for board with ID \`${this.boardId}\``);
    return response;
  },
};

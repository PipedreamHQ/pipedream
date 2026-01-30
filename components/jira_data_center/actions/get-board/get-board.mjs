import jiraDataCenter from "../../jira_data_center.app.mjs";

export default {
  name: "Get Board",
  key: "jira_data_center-get-board",
  description: "Retrieves a board. [See the documentation](https://developer.atlassian.com/server/jira/platform/rest/v10002/api-group-board/#api-agile-1-0-board-boardid-get)",
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
    const response = await this.jiraDataCenter.getBoard({
      $,
      boardId: this.boardId,
    });

    $.export("$summary", `Successfully got board with ID \`${response.id}\``);

    return response;
  },
};

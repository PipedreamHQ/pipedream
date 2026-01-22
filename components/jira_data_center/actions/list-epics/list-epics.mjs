import jiraDataCenter from "../../jira_data_center.app.mjs";

export default {
  name: "List Epics",
  description: "Lists the epics for a given board. [See the documentation](https://developer.atlassian.com/server/jira/platform/rest/v10002/api-group-board/#api-agile-1-0-board-boardid-epic-get)",
  key: "jira_data_center-list-epics",
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
    const response = await this.jiraDataCenter.listEpics({
      $,
      boardId: this.boardId,
      params: {
        maxResults: this.maxResults,
        startAt: this.startAt,
      },
    });
    $.export("$summary", `Successfully fetched ${response.values?.length || 0} epics for board with ID \`${this.boardId}\``);
    return response;
  },
};

import jiraDataCenter from "../../jira_data_center.app.mjs";

export default {
  name: "Create Future Sprint",
  description: "Creates a future sprint. [See the documentation](https://developer.atlassian.com/server/jira/platform/rest/v10002/api-group-sprint/#api-agile-1-0-sprint-post)",
  key: "jira_data_center-create-future-sprint",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    jiraDataCenter,
    name: {
      propDefinition: [
        jiraDataCenter,
        "name",
      ],
    },
    boardId: {
      propDefinition: [
        jiraDataCenter,
        "boardId",
      ],
    },
    startDate: {
      propDefinition: [
        jiraDataCenter,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        jiraDataCenter,
        "endDate",
      ],
    },
    autoStartStop: {
      propDefinition: [
        jiraDataCenter,
        "autoStartStop",
      ],
    },
    goal: {
      propDefinition: [
        jiraDataCenter,
        "goal",
      ],
    },
    synced: {
      propDefinition: [
        jiraDataCenter,
        "synced",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.jiraDataCenter.createFutureSprint({
      $,
      data: {
        name: this.name,
        originBoardId: this.boardId,
        startDate: this.startDate,
        endDate: this.endDate,
        autoStartStop: this.autoStartStop,
        goal: this.goal,
        synced: this.synced,
      },
    });
    $.export("$summary", `Successfully created sprint with ID \`${response.id}\``);
    return response;
  },
};

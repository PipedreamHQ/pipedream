import jiraDataCenter from "../../jira_data_center.app.mjs";

export default {
  name: "Update Sprint Fully",
  description: "Performs a full update of a sprint. A full update means that the result will be exactly the same as the request body. Any fields not present in the request JSON will be set to null. [See the documentation](https://developer.atlassian.com/server/jira/platform/rest/v10002/api-group-sprint/#api-agile-1-0-sprint-sprintid-put)",
  key: "jira_data_center-update-sprint-fully",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
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
    sprintId: {
      propDefinition: [
        jiraDataCenter,
        "sprintId",
        (c) => ({
          boardId: c.boardId,
        }),
      ],
    },
    name: {
      propDefinition: [
        jiraDataCenter,
        "name",
      ],
    },
    state: {
      propDefinition: [
        jiraDataCenter,
        "state",
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
    activatedDate: {
      propDefinition: [
        jiraDataCenter,
        "activatedDate",
      ],
    },
    completedDate: {
      propDefinition: [
        jiraDataCenter,
        "completedDate",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.jiraDataCenter.updateSprint({
      $,
      sprintId: this.sprintId,
      data: {
        id: this.sprintId,
        name: this.name,
        originBoardId: this.boardId,
        startDate: this.startDate,
        endDate: this.endDate,
        autoStartStop: this.autoStartStop,
        goal: this.goal,
        synced: this.synced,
        activatedDate: this.activatedDate,
        completedDate: this.completedDate,
        state: this.state,
      },
    });
    $.export("$summary", `Successfully updated sprint with ID \`${response.id}\``);
    return response;
  },
};

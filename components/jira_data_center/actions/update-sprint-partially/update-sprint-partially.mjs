import jiraDataCenter from "../../jira_data_center.app.mjs";

export default {
  name: "Update Sprint Partially",
  description: "Performs a partial update of a sprint. A partial update means that fields not present in the request JSON will not be updated. [See the documentation](https://developer.atlassian.com/server/jira/platform/rest/v10002/api-group-sprint/#api-agile-1-0-sprint-sprintid-post)",
  key: "jira_data_center-update-sprint-partially",
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
      optional: true,
    },
    state: {
      propDefinition: [
        jiraDataCenter,
        "state",
      ],
      optional: true,
    },
    startDate: {
      propDefinition: [
        jiraDataCenter,
        "startDate",
      ],
      optional: true,
    },
    endDate: {
      propDefinition: [
        jiraDataCenter,
        "endDate",
      ],
      optional: true,
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
    const response = await this.jiraDataCenter.updateSprintPartial({
      $,
      sprintId: this.sprintId,
      data: {
        name: this.name,
        state: this.state,
        startDate: this.startDate,
        endDate: this.endDate,
        autoStartStop: this.autoStartStop,
        goal: this.goal,
        synced: this.synced,
        activatedDate: this.activatedDate,
        completedDate: this.completedDate,
      },
    });
    $.export("$summary", `Successfully updated sprint with ID \`${response.id}\``);
    return response;
  },
};

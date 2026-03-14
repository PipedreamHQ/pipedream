import jira from "../../jira.app.mjs";

export default {
  key: "jira-create-future-sprint",
  name: "Create Future Sprint",
  description: "Creates a future sprint. [See the documentation](https://developer.atlassian.com/cloud/jira/software/rest/api-group-sprint/#api-rest-agile-1-0-sprint-post)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    jira,
    boardId: {
      propDefinition: [
        jira,
        "boardId",
      ],
      description: "The ID of the board the sprint will be created on.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the sprint.",
    },
    goal: {
      type: "string",
      label: "Goal",
      description: "The goal of the sprint.",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the sprint in ISO 8601 format (e.g. `2024-01-01T00:00:00.000Z`).",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the sprint in ISO 8601 format (e.g. `2024-01-15T00:00:00.000Z`).",
      optional: true,
    },
  },
  /**
   * Runs the action and returns the API response.
   * @param {object} $ - The Pipedream step context
   * @returns {Promise<object>} The API response
   */
  async run({ $ }) {
    const response = await this.jira.createSprint({
      $,
      data: {
        originBoardId: parseInt(this.boardId),
        name: this.name,
        goal: this.goal,
        startDate: this.startDate,
        endDate: this.endDate,
      },
    });
    $.export("$summary", `Successfully created sprint "${response?.name}" with ID ${response?.id}`);
    return response;
  },
};

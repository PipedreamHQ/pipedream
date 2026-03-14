import jira from "../../jira.app.mjs";

export default {
  key: "jira-get-sprint",
  name: "Get Sprint",
  description: "Returns the sprint for a given sprint ID. [See the documentation](https://developer.atlassian.com/cloud/jira/software/rest/api-group-sprint/#api-rest-agile-1-0-sprint-sprintid-get)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    readOnlyHint: true,
    openWorldHint: true,
  },
  props: {
    jira,
    boardId: {
      propDefinition: [
        jira,
        "boardId",
      ],
    },
    sprintId: {
      propDefinition: [
        jira,
        "sprintId",
        (c) => ({
          boardId: c.boardId,
        }),
      ],
    },
  },
  /**
   * Runs the action and returns the API response.
   * @param {object} $ - The Pipedream step context
   * @returns {Promise<object>} The API response
   */
  async run({ $ }) {
    const response = await this.jira.getSprint({
      $,
      sprintId: this.sprintId,
    });
    $.export("$summary", `Successfully retrieved sprint with ID ${this.sprintId}`);
    return response;
  },
};

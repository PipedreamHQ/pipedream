import jira from "../../jira.app.mjs";

export default {
  key: "jira-list-board-issues",
  name: "List Board Issues",
  description: "Returns all issues from a board, for the given board ID. [See the documentation](https://developer.atlassian.com/cloud/jira/software/rest/api-group-board/#api-rest-agile-1-0-board-boardid-issue-get)",
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
    startAt: {
      type: "integer",
      label: "Start At",
      description: "The starting index of the returned issues. Base index: 0.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of issues to return.",
      optional: true,
    },
    jql: {
      type: "string",
      label: "JQL",
      description: "Filters results using a JQL query.",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "A list of fields to return for each issue. Accepts a comma-separated list.",
      optional: true,
    },
    expand: {
      propDefinition: [
        jira,
        "expand",
      ],
    },
  },
  /**
   * Runs the action and returns the API response.
   * @param {object} $ - The Pipedream step context
   * @returns {Promise<object>} The API response
   */
  async run({ $ }) {
    const response = await this.jira.listBoardIssues({
      $,
      boardId: this.boardId,
      params: {
        startAt: this.startAt,
        maxResults: this.maxResults,
        jql: this.jql,
        fields: this.fields,
        expand: this.expand,
      },
    });
    const count = response?.issues?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} issue${count !== 1
      ? "s"
      : ""} from board ${this.boardId}`);
    return response;
  },
};

import jira from "../../jira.app.mjs";

export default {
  key: "jira-get-board",
  name: "Get Board",
  description: "Returns the board for the given board ID. [See the documentation](https://developer.atlassian.com/cloud/jira/software/rest/api-group-board/#api-rest-agile-1-0-board-boardid-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    readOnlyHint: true,
    openWorldHint: true,
  },
  props: {
    jira,
    cloudId: {
      propDefinition: [
        jira,
        "cloudId",
      ],
    },
    boardId: {
      propDefinition: [
        jira,
        "boardId",
        (c) => ({
          cloudId: c.cloudId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.jira.getBoard({
      $,
      cloudId: this.cloudId,
      boardId: this.boardId,
    });
    $.export("$summary", `Successfully retrieved board with ID ${this.boardId}`);
    return response;
  },
};

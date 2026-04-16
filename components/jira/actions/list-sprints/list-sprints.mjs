import jira from "../../jira.app.mjs";

export default {
  key: "jira-list-sprints",
  name: "List Sprints",
  description: "Returns all sprints from a board, for the given board ID. [See the documentation](https://developer.atlassian.com/cloud/jira/software/rest/api-group-board/#api-rest-agile-1-0-board-boardid-sprint-get)",
  version: "0.0.2",
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
    startAt: {
      type: "integer",
      label: "Start At",
      description: "The starting index of the returned sprints. Base index: 0.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of sprints to return.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "Filters results to sprints in the specified states. Accepts a comma-separated list of: `future`, `active`, `closed`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.jira.listSprints({
      $,
      cloudId: this.cloudId,
      boardId: this.boardId,
      params: {
        startAt: this.startAt,
        maxResults: this.maxResults,
        state: this.state,
      },
    });
    const count = response?.values?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} sprint${count !== 1
      ? "s"
      : ""} from board ${this.boardId}`);
    return response;
  },
};

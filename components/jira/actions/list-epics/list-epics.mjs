import jira from "../../jira.app.mjs";

export default {
  key: "jira-list-epics",
  name: "List Epics",
  description: "Returns all epics from a board, for the given board ID. [See the documentation](https://developer.atlassian.com/cloud/jira/software/rest/api-group-board/#api-rest-agile-1-0-board-boardid-epic-get)",
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
      description: "The starting index of the returned epics. Base index: 0.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of epics to return.",
      optional: true,
    },
    done: {
      type: "boolean",
      label: "Done",
      description: "Filters results to epics that are either done or not done. If not provided, all epics are returned.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.jira.listEpics({
      $,
      cloudId: this.cloudId,
      boardId: this.boardId,
      params: {
        startAt: this.startAt,
        maxResults: this.maxResults,
        done: this.done,
      },
    });
    const count = response?.values?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} epic${count !== 1
      ? "s"
      : ""} from board ${this.boardId}`);
    return response;
  },
};

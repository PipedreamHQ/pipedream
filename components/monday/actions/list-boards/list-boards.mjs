import monday from "../../monday.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "monday-list-boards",
  name: "List Boards",
  description: "List boards with their full details — columns, groups, owners, subscribers, tags and workspace. Use when you need board metadata; use **List Board ID Options** when you only need an ID and a name, which returns a far smaller response. Narrow the results with `Board IDs`, `Workspace IDs`, `Board Kind` and `State`. Example: Limit `25`, Page `1`, State `active`. Returns an array of board objects. If exactly `Limit` boards come back there are probably more — call again with `Page` incremented by 1. [See the documentation](https://developer.monday.com/api-reference/reference/boards)",
  version: "0.0.4",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    monday,
    boardIds: {
      propDefinition: [
        monday,
        "boardIds",
      ],
      description: "Return only these boards, as an array of board IDs. Use **List Board ID Options** to find valid IDs. Omit to return all boards.",
    },
    workspaceIds: {
      propDefinition: [
        monday,
        "workspaceIds",
      ],
    },
    boardKind: {
      propDefinition: [
        monday,
        "boardKind",
      ],
      description: "Filter the results to boards of a specific kind (`public` / `private` / `share`)",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "Filter the results to boards in a specific state (`active` / `archived` / `deleted` / `all`). Defaults to `all`.",
      optional: true,
      default: "all",
      options: constants.STATE_OPTIONS,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "The field to sort results by (`created_at` / `used_at`). Defaults to `created_at`.",
      optional: true,
      default: "created_at",
      options: constants.BOARDS_ORDER_BY_OPTIONS,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of boards to return per page. Defaults to 25. If exactly this many boards are returned there are probably more, so call again with `Page` incremented by 1.",
      optional: true,
      default: 25,
      min: 1,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to return, starting at 1. Increment this to walk through boards when a call returns a full page of `Limit` results.",
      optional: true,
      default: 1,
      min: 1,
    },
  },
  async run({ $ }) {
    const response = await this.monday.listBoards({
      page: this.page,
      limit: this.limit,
      ids: this.boardIds,
      boardKind: this.boardKind,
      state: this.state,
      orderBy: this.orderBy,
      workspaceIds: this.workspaceIds,
    });
    if (response.errors) {
      throw new Error(`Failed to list boards: ${response.errors[0].message}`);
    }

    const boards = response.data?.boards ?? [];
    const boardCount = boards.length;
    $.export("$summary", `Successfully retrieved ${boardCount} board${boardCount === 1
      ? ""
      : "s"}`);
    return boards;
  },
};

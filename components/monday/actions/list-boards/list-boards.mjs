import monday from "../../monday.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "monday-list-boards",
  name: "List Boards",
  description: "List all boards. [See the documentation](https://developer.monday.com/api-reference/reference/boards)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    monday,
    ids: {
      propDefinition: [
        monday,
        "boardIds",
      ],
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
      description: "The maximum number of boards to return per page. Defaults to 25.",
      optional: true,
      min: 1,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to return. Defaults to 1.",
      optional: true,
      default: 1,
      min: 1,
    },
  },
  async run({ $ }) {
    const response = await this.monday.listBoards({
      page: this.page,
      limit: this.limit,
      ids: this.ids,
      boardKind: this.boardKind,
      state: this.state,
      orderBy: this.orderBy,
      workspaceIds: this.workspaceIds,
    });
    const boardCount = response.data?.boards?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${boardCount} board${boardCount === 1
      ? ""
      : "s"}`);
    return response;
  },
};

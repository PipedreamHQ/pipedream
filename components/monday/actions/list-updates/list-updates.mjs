import monday from "../../monday.app.mjs";

export default {
  key: "monday-list-updates",
  name: "List Updates",
  description: "List the updates (comments) posted on a board's items, including each update's ID, body and author. Use this to discover the `Parent Update ID` required by **Create an Update** when replying to an existing update. Set `Board ID`. Example: Limit `25`, Page `1`. Returns an array of update objects, each carrying the `item_id` of the item it was posted on. If exactly `Limit` updates come back there are probably more — call again with `Page` incremented by 1. [See the documentation](https://developer.monday.com/api-reference/reference/updates#queries)",
  type: "action",
  ai: "optimized",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    monday,
    boardId: {
      propDefinition: [
        monday,
        "boardId",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of updates to return per page. Defaults to 25. If exactly this many updates are returned there are probably more, so call again with `Page` incremented by 1.",
      optional: true,
      default: 25,
      min: 1,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to return, starting at 1. Increment this to walk through updates when a call returns a full page of `Limit` results.",
      optional: true,
      default: 1,
      min: 1,
    },
  },
  async run({ $ }) {
    const updates = await this.monday.listUpdates({
      boardId: this.boardId,
      limit: this.limit,
      page: this.page,
    });

    if (!updates) {
      throw new Error(`No board found with ID ${this.boardId}. Check that the board ID is correct and that the connected account can access it.`);
    }

    $.export("$summary", `Successfully retrieved ${updates.length} update${updates.length === 1
      ? ""
      : "s"}`);

    return updates;
  },
};

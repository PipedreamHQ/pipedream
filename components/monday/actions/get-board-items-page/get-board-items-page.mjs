import common from "../common/column-values.mjs";

export default {
  ...common,
  key: "monday-get-board-items-page",
  name: "Get Board Items Page",
  description: "Retrieves all items from a board. [See the documentation](https://developer.monday.com/api-reference/reference/items-page)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
  },
  async run({ $ }) {
    const response = await this.monday.listBoardItemsPage({
      boardId: +this.boardId,
    });

    if (response.errors) {
      throw new Error(response.errors[0].message);
    }

    const {
      data: {
        boards: [
          { items_page: pageItems },
        ],
      },
    } = response;
    const { items } = pageItems;
    let cursor = pageItems?.cursor;
    while (cursor) {
      const {
        data: {
          boards: {
            items_page: {
              cursor: nextCursor, items: nextItems,
            },
          },
        },
      } = await this.monday.listBoardItemsPage({
        boardId: +this.boardId,
        cursor,
      });
      items.push(...nextItems);
      cursor = nextCursor;
    }

    $.export("$summary", `Successfully retrieved ${items.length} item${items.length === 1
      ? ""
      : "s"}.`);

    return items;
  },
};

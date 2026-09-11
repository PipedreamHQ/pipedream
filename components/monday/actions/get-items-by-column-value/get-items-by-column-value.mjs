import common from "../common/column-values.mjs";

export default {
  ...common,
  key: "monday-get-items-by-column-value",
  name: "Get Items By Column Value",
  description: "Find every item on a board whose column matches a value, following the API's cursor automatically so all matches are returned in a single call. Use to look up items by a field instead of pulling the whole board with **Get Board Items Page**. Set `Board ID`, `Column` and `Value`. For a `status` or `dropdown` column pass the label text rather than its ID — call **List Columns** to see the labels a column accepts. Example: Column `status`, Value `Done`. Returns an array of matching items, each with a `column_values` array of `{ id, value }` pairs; an empty array means nothing matched. Gotcha: not every column type is searchable this way. [See the documentation](https://developer.monday.com/api-reference/reference/items-page-by-column-values)",
  version: "0.1.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    ...common.props,
    columnId: {
      propDefinition: [
        common.props.monday,
        "column",
        (c) => ({
          boardId: c.boardId,
        }),
      ],
      description: "The column to search",
    },
    value: {
      type: "string",
      label: "Value",
      description: "The value to search for. For a `status` or `dropdown` column this is the label text rather than its ID (for example, `Done`) — use **List Columns** to see the labels a column accepts. [See the documentation](https://developer.monday.com/api-reference/reference/items-page-by-column-values#supported-and-unsupported-columns) for which column types are searchable and what value each one expects",
    },
  },
  async run({ $ }) {
    const response = await this.monday.getItemsByColumnValue({
      boardId: +this.boardId,
      columnId: this.columnId,
      columnValue: this.value,
    });

    if (response.errors) {
      throw new Error(response.errors[0].message);
    }

    const { data: { items_page_by_column_values: pageItems } } = response;
    const { items } = pageItems;
    let cursor = pageItems?.cursor;
    while (cursor) {
      const {
        data: {
          next_items_page: {
            cursor: nextCursor, items: nextItems,
          },
        },
      } = await this.monday.getItemsByColumnValue({
        cursor,
      });
      items.push(...nextItems);
      cursor = nextCursor;
    }

    $.export("$summary", `Successfully retrieved ${items.length} item${items.length === 1
      ? ""
      : "s"}.`);

    return this.formatColumnValues(items);
  },
};

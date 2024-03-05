import common from "../common/column-values.mjs";

export default {
  ...common,
  key: "monday-get-items-by-column-value",
  name: "Get Items By Column Value",
  description: "Searches a column for items matching a value. [See the documentation](https://developer.monday.com/api-reference/docs/items-page-by-column-values)",
  version: "0.0.3",
  type: "action",
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
      description: "The value to serach for. [See documentation](https://developer.monday.com/api-reference/docs/items-by-column-values#supported-limited-support-and-unsupported-columns) for additional information about column values.",
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
          cursor: nextCursor, items_page_by_column_values: { items: nextItems },
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

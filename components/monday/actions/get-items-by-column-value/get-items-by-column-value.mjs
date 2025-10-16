import { getColumnOptions } from "../../common/utils.mjs";
import common from "../common/column-values.mjs";

export default {
  ...common,
  key: "monday-get-items-by-column-value",
  name: "Get Items By Column Value",
  description: "Searches a column for items matching a value. [See the documentation](https://developer.monday.com/api-reference/reference/items-page-by-column-values)",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      reloadProps: true,
    },
  },
  async additionalProps() {
    const columnData = await this.monday.listColumns({
      boardId: +this.boardId,
    });

    const options = getColumnOptions(columnData, this.columnId, true);

    return {
      value: {
        type: "string",
        label: "Value",
        description: `The value to search for.${options
          ? ""
          : " [See the documentation](https://developer.monday.com/api-reference/reference/items-page-by-column-values#supported-and-unsupported-columns) for additional information about column values"} `,
        options,
      },
    };
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

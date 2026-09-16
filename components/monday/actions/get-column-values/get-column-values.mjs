import common from "../common/column-values.mjs";

export default {
  ...common,
  key: "monday-get-column-values",
  name: "Get Column Values",
  description: "Read the column values of one item. Use when you already have an `Item ID` and want its field values; use **Get Items By Column Value** to search for items by a value instead. Set `Board ID` and `Item ID`; leave `Column IDs` empty to return every column, or pass specific column IDs from **List Columns**. Example: Item ID `9876543210`, Column IDs `[\"status\", \"date4\"]`. Returns an array holding the item and a `column_values` array of `{ id, value }` pairs, where `value` is the column's display text when one exists and the raw JSON value otherwise. [See the documentation](https://developer.monday.com/api-reference/reference/column-values-v2)",
  version: "0.0.14",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    ...common.props,
    itemId: {
      propDefinition: [
        common.props.monday,
        "itemId",
        ({ boardId }) => ({
          boardId: +boardId,
        }),
      ],
      optional: false,
    },
    columnIds: {
      propDefinition: [
        common.props.monday,
        "column",
        (c) => ({
          boardId: c.boardId,
        }),
      ],
      type: "string[]",
      label: "Column IDs",
      description: "Return only these columns, as an array of column IDs (e.g. `[\"status\", \"date4\"]`). Use **List Columns** to find valid IDs. Omit to return every column on the board.",
      optional: true,
    },
  },
  async run({ $ }) {
    let columnIds = this.columnIds;
    if (!columnIds?.length) {
      const columns = await this.getColumns(this.boardId);
      columnIds = columns.map(({ id }) => id);
    }

    const response = await this.monday.getColumnValues({
      itemId: +this.itemId,
      columnIds: columnIds,
    });

    if (response.errors) {
      throw new Error(response.errors[0].message);
    }

    $.export("$summary", `Successfully retrieved column values for item with ID ${this.itemId}`);

    return this.formatColumnValues(response.data.items);
  },
};

import common from "../common/column-values.mjs";

export default {
  ...common,
  key: "monday-get-column-values",
  name: "Get Column Values",
  description: "Return values of specific column(s) for a board item. [See the documentation](https://developer.monday.com/api-reference/reference/column-values-v2)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
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
      label: "Columns",
      description: "Select the column(s) to return data from",
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

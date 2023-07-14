import common from "../common/column-values.mjs";

export default {
  ...common,
  key: "monday-get-column-values",
  name: "Get Column Values",
  description: "Return values of a specific column or columns for a board item. [See the documentation](https://developer.monday.com/api-reference/docs/column-values-v2)",
  version: "0.0.1",
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
      description: "Return data from the specified column(s)",
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

    $.export("$summary", `Successfully retrieved column values for item with ID ${this.itemId}.`);

    return this.formatColumnValues(response.data.items);
  },
};

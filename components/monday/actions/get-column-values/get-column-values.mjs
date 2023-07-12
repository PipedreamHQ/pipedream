import monday from "../../monday.app.mjs";

export default {
  key: "monday-get-column-values",
  name: "Get Column Values",
  description: "Return values of a specific column or columns for a board item. [See the documentation](https://developer.monday.com/api-reference/docs/column-values-v2)",
  version: "0.0.1",
  type: "action",
  props: {
    monday,
    boardId: {
      propDefinition: [
        monday,
        "boardId",
      ],
    },
    itemId: {
      propDefinition: [
        monday,
        "itemId",
        ({ boardId }) => ({
          boardId: +boardId,
        }),
      ],
      optional: false,
    },
    columnIds: {
      propDefinition: [
        monday,
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
      const columns = await this.monday.listColumns({
        boardId: +this.boardId,
      });
      columnIds = columns.filter(({ id }) => id !== "name").map(({ id }) => id);
    }

    const response = await this.monday.getColumnValues({
      itemId: +this.itemId,
      columnIds: columnIds,
    });

    if (!response.errors) {
      $.export("$summary", `Successfully retrieved column values for item with ID ${response.data.items[0].id}.`);
    }

    return response.data.items[0];
  },
};

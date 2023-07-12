import monday from "../../monday.app.mjs";

export default {
  key: "monday-get-column-values",
  name: "Get Column Values",
  description: "Return all data for a specific column in a board. [See the documentation](https://developer.monday.com/api-reference/docs/column-values-v2)",
  //version: "0.0.1",
  version: "0.0.3",
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
    columnId: {
      propDefinition: [
        monday,
        "column",
        (c) => ({
          boardId: c.boardId,
        }),
      ],
      description: "Return data from the specified column",
    },
  },
  async run({ $ }) {
    const values = await this.monday.getColumnValues({
      boardId: +this.boardId,
      itemId: +this.itemId,
      columnId: +this.column,
    });

    $.export("$summary", "Successfully retrieved column values.");

    return values;
  },
};

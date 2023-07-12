import monday from "../../monday.app.mjs";

export default {
  key: "monday-get-items-by-column-value",
  name: "Get Items By Column Value",
  description: "Searches a column for items matching a value. [See the documentation](https://developer.monday.com/api-reference/docs/items-page-by-column-values)",
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
    columnId: {
      propDefinition: [
        monday,
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

    if (!response.errors) {
      $.export("$summary", `Successfully retrieved ${response.data.items_by_column_values.length} item${response.data.items_by_column_values.length === 1
        ? ""
        : "s"}.`);
    }

    return response;
  },
};

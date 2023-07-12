import monday from "../../monday.app.mjs";

export default {
  key: "monday-update-column-values",
  name: "Update Column Values",
  description: "Update multiple column values of an item. [See the documentation](https://developer.monday.com/api-reference/docs/columns#change-multiple-column-values)",
  version: "0.0.1",
  type: "action",
  props: {
    monday,
    boardId: {
      propDefinition: [
        monday,
        "boardId",
      ],
      reloadProps: true,
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
  },
  async additionalProps() {
    const props = {};
    if (this.boardId) {
      const columns = await this.getColumns();
      for (const column of columns) {
        props[column.id] = {
          type: "string",
          label: column.title,
          description: `The value for column ${column.title}`,
          optional: true,
        };
      }
    }
    return props;
  },
  methods: {
    async getColumns() {
      const columns = await this.monday.listColumns({
        boardId: +this.boardId,
      });
      return columns.filter(({ id }) => id !== "name");
    },
  },
  async run({ $ }) {
    const columns = await this.getColumns();
    const columnValues = {};
    for (const column of columns) {
      if (this[column.id]) {
        columnValues[column.id] = this[column.id];
      }
    }

    const response = await this.monday.updateColumnValues({
      boardId: +this.boardId,
      itemId: +this.itemId,
      columnValues: JSON.stringify(columnValues),
    });

    if (!response.errors) {
      $.export("$summary", `Successfully updated item with ID ${response.data.change_multiple_column_values.id}.`);
    }

    return response.data.change_multiple_column_values;
  },
};

import common from "../common/column-values.mjs";

export default {
  ...common,
  key: "monday-update-column-values",
  name: "Update Column Values",
  description: "Update multiple column values of an item. [See the documentation](https://developer.monday.com/api-reference/docs/columns#change-multiple-column-values)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    boardId: {
      ...common.props.boardId,
      reloadProps: true,
    },
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
  },
  async additionalProps() {
    const props = {};
    if (this.boardId) {
      const columns = await this.getColumns(this.boardId);
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
  async run({ $ }) {
    const columns = await this.getColumns(this.boardId);
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

    if (response.errors) {
      throw new Error(response.errors[0].message);
    }

    const { data: { change_multiple_column_values: item } } = response;

    $.export("$summary", `Successfully updated item with ID ${item.id}.`);

    return this.formatColumnValues([
      item,
    ]);
  },
};

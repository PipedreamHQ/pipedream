import monday from "../../monday.app.mjs";

export default {
  key: "monday-update-item-name",
  name: "Update Item Name",
  description: "Update an item's name. [See the documentation](https://developer.monday.com/api-reference/reference/columns#change-multiple-column-values)",
  type: "action",
  version: "0.0.11",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    monday,
    boardId: {
      propDefinition: [
        monday,
        "boardId",
      ],
    },
    itemId: {
      optional: false,
      propDefinition: [
        monday,
        "itemId",
        ({ boardId }) => ({
          boardId: +boardId,
        }),
      ],
    },
    itemName: {
      propDefinition: [
        monday,
        "itemName",
      ],
    },
  },
  async run({ $ }) {
    const {
      data,
      errors,
      error_message: errorMessage,
    } =
      await this.monday.updateItemName({
        boardId: +this.boardId,
        itemId: +this.itemId,
        columnValues: JSON.stringify({
          name: this.itemName,
        }),
      });

    if (errors) {
      throw new Error(`Failed to update the item name: ${errors[0].message}`);
    }

    if (errorMessage) {
      throw new Error(`Failed to update the item name: ${errorMessage}`);
    }

    const { id: updateItemId } = data.change_multiple_column_values;

    $.export("$summary", `Successfully updated item ${updateItemId} to name ${this.itemName}`);

    return updateItemId;
  },
};

import monday from "../../monday.app.mjs";

export default {
  key: "monday-update-item-name",
  name: "Update Item Name",
  description: "Rename an existing item. Use for the item's name only — **Update Column Values** cannot change it, and this action changes nothing else. Set `Board ID`, `Item ID` and the new `Item Name`. Example: Item ID `9876543210`, Item Name `Website redesign v2`. Returns the item's ID as a string. Use **Get Board Items Page** or **Get Items By Column Value** to find an `Item ID`. [See the documentation](https://developer.monday.com/api-reference/reference/columns#change-multiple-column-values)",
  type: "action",
  ai: "optimized",
  version: "0.0.18",
  annotations: {
    destructiveHint: false,
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

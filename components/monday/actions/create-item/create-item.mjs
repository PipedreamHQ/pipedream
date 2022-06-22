import monday from "../../monday.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "monday-create-item",
  name: "Create Item",
  description: "Creates an item. [See the docs here](https://api.developer.monday.com/docs/items-queries#create-an-item)",
  type: "action",
  version: "0.0.1",
  props: {
    monday,
    boardId: {
      propDefinition: [
        monday,
        "boardId",
      ],
    },
    groupId: {
      propDefinition: [
        monday,
        "groupId",
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
    columnValues: {
      propDefinition: [
        monday,
        "itemColumnValues",
      ],
    },
    createLabels: {
      propDefinition: [
        monday,
        "itemCreateLabels",
      ],
    },
  },
  async run({ $ }) {
    const {
      data,
      errors,
      error_message: errorMessage,
    } =
      await this.monday.createItem({
        boardId: +this.boardId,
        groupId: utils.emptyStrToUndefined(this.groupId),
        itemName: utils.emptyStrToUndefined(this.itemName),
        columnValues: utils.strinfied(this.columnValues),
        createLabels: utils.emptyStrToUndefined(this.createLabels),
      });

    if (errors) {
      throw new Error(`Failed to create item: ${errors[0].message}`);
    }

    if (errorMessage) {
      throw new Error(`Failed to create item: ${errorMessage}`);
    }

    const { id: itemId } = data.create_item;

    $.export("$summary", `Successfully created a new item with ID: ${itemId}`);

    return itemId;
  },
};

import monday from "../../monday.app.mjs";
import commonCreateItem from "../common/common-create-item.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...commonCreateItem,
  key: "monday-create-item",
  name: "Create Item",
  description: "Creates an item. [See the documentation](https://api.developer.monday.com/docs/items-queries#create-an-item)",
  type: "action",
  version: "0.0.9",
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
    createLabels: {
      propDefinition: [
        monday,
        "itemCreateLabels",
      ],
    },
    ...commonCreateItem.props,
  },
  methods: {
    ...commonCreateItem.methods,
    sendRequest({ columnValues }) {
      return this.monday.createItem({
        boardId: +this.boardId,
        groupId: utils.emptyStrToUndefined(this.groupId),
        itemName: utils.emptyStrToUndefined(this.itemName),
        columnValues: utils.strinfied(columnValues),
        createLabels: utils.emptyStrToUndefined(this.createLabels),
      });
    },
    getItemId(data) {
      return data.create_item.id;
    },
  },
};

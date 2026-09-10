import monday from "../../monday.app.mjs";
import commonCreateItem from "../common/common-create-item.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...commonCreateItem,
  key: "monday-create-item",
  name: "Create Item",
  description: "Create an item (a row) on a board. Use for a top-level row; use **Create Subitem** for a row nested under an existing item. Set `Board ID` and `Item Name`, and optionally `Group ID` and `Column Values`. Call **List Columns** first to get the column IDs and the labels a `status` or `dropdown` column accepts. Example: Item Name `Website redesign`, Column Values `{ \"status\": \"Working on it\", \"date4\": \"2026-09-02\", \"numbers\": 42 }`. Set `Item Create Labels` to `true` to allow missing `status`/`dropdown` labels to be created, which requires permission to change the board structure. Returns the new item's ID as a string (e.g. `9876543210`). [See the documentation](https://developer.monday.com/api-reference/reference/items#create-an-item)",
  type: "action",
  ai: "optimized",
  version: "0.1.9",
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

import utils from "../../common/utils.mjs";
import monday from "../../monday.app.mjs";
import commonCreateItem from "../common/common-create-item.mjs";

export default {
  ...commonCreateItem,
  key: "monday-create-subitem",
  name: "Create Subitem",
  description: "Create a subitem nested under an existing item. Use when the row belongs to a parent item; use **Create Item** for a top-level row. Set `Board ID` (the parent item's board), `Parent Item ID` and `Item Name`. Gotcha: subitems live on a separate subitems board, so `Column Values` must use that board's column IDs — run **List Columns** against the subitems board, not the board selected here. Example: Item Name `Draft copy`, Column Values `{ \"status\": \"Done\" }`. Returns the new subitem's ID as a string. [See the documentation](https://developer.monday.com/api-reference/reference/subitems#create-a-subitem)",
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
    parentItemId: {
      propDefinition: [
        monday,
        "itemId",
        ({ boardId }) => ({
          boardId: +boardId,
        }),
      ],
      optional: false,
      description: "Select a parent item or provide an item ID",
    },
    itemName: {
      propDefinition: [
        monday,
        "itemName",
      ],
      description: "The new subitem's name",
    },
    ...commonCreateItem.props,
    columnValues: {
      ...commonCreateItem.props.columnValues,
      label: "Column Values",
      description: "The subitem column values to set, as column ID → value pairs. Example: `{ \"status\": \"Done\", \"date4\": \"2026-09-02\" }`. These are the columns of the parent item's **subitems board**, which is a separate board from the one selected above — run **List Columns** against that subitems board to discover its column IDs. See the [Column types reference](https://developer.monday.com/api-reference/reference/column-types-reference) for the value each column type expects",
    },
  },
  methods: {
    ...commonCreateItem.methods,
    sendRequest({ columnValues }) {
      return this.monday.createSubItem({
        parentItemId: utils.emptyStrToUndefined(this.parentItemId),
        itemName: utils.emptyStrToUndefined(this.itemName),
        columnValues: utils.strinfied(columnValues),
      });
    },
    getItemId(data) {
      return data.create_subitem.id;
    },
  },
};

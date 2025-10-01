import utils from "../../common/utils.mjs";
import monday from "../../monday.app.mjs";
import commonCreateItem from "../common/common-create-item.mjs";

export default {
  ...commonCreateItem,
  key: "monday-create-subitem",
  name: "Create Subitem",
  description: "Creates a subitem. [See the documentation](https://developer.monday.com/api-reference/reference/subitems#create-a-subitem)",
  type: "action",
  version: "0.1.1",
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

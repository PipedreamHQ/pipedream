import utils from "../../common/utils.mjs";
import monday from "../../monday.app.mjs";
import commonCreateItem from "../common/common-create-item.mjs";

export default {
  ...commonCreateItem,
  key: "monday-create-subitem",
  name: "Create Subitem",
  description: "Creates a subitem. [See the documentation](https://developer.monday.com/api-reference/docs/introduction-to-graphql#mondaycom-schema)",
  type: "action",
  version: "0.0.2",
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
      description: "The parent item's unique identifier",
    },
    itemName: {
      propDefinition: [
        monday,
        "itemName",
      ],
      description: "The new subitem's name",
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
      return this.monday.createSubItem({
        parentItemId: utils.emptyStrToUndefined(this.parentItemId),
        itemName: utils.emptyStrToUndefined(this.itemName),
        columnValues: utils.strinfied(columnValues),
        createLabels: utils.emptyStrToUndefined(this.createLabels),
      });
    },
    getItemId(data) {
      return data.create_subitem.id;
    },
  },
};

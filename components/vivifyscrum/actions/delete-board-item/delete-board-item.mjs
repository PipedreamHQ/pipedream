import vivifyscrum from "../../vivifyscrum.app.mjs";

export default {
  key: "vivifyscrum-delete-board-item",
  name: "Delete Board Item",
  description: "Deletes a board item from VivifyScrum. [See the documentation](https://github.com/Vivify-Ideas/vivify-cli)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    vivifyscrum,
    itemHashcode: {
      propDefinition: [
        vivifyscrum,
        "itemHashcode",
      ],
      description: "The hashcode (ID) of the board item to delete without the prefix `#`",
    },
    removeSubitems: {
      type: "boolean",
      label: "Remove Subitems",
      description: "If true, also delete all subitems (subtasks) of this item",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.vivifyscrum.deleteBoardItem({
      $,
      data: {
        board: this.boardCode,
        task: this.itemHashcode,
        delete_subtasks: this.removeSubitems,
      },
    });

    $.export("$summary", "Board item deleted successfully");
    return response;
  },
};

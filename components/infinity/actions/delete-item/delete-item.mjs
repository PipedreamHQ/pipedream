import infinity from "../../infinity.app.mjs";

export default {
  key: "infinity-delete-item",
  name: "Delete Item",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Delete a specific item. [See the documentation](https://s3.amazonaws.com/devdocs.startinfinity.com/index.html#items-DELETEapi-v2-workspaces--workspace--boards--board_id--items--item_id-)",
  type: "action",
  props: {
    infinity,
    workspaceId: {
      propDefinition: [
        infinity,
        "workspaceId",
      ],
    },
    boardId: {
      propDefinition: [
        infinity,
        "boardId",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
    },
    itemId: {
      propDefinition: [
        infinity,
        "itemId",
        ({
          workspaceId, boardId,
        }) => ({
          workspaceId,
          boardId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.infinity.deleteItem({
      $,
      workspaceId: this.workspaceId,
      boardId: this.boardId,
      itemId: this.itemId,
    });

    $.export("$summary", `The item with Id: ${response.id} was successfully deleted!`);
    return response;
  },
};

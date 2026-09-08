// x-pd-ai: optimized
import canva from "../../canva.app.mjs";

export default {
  key: "canva-move-folder-item",
  name: "Move Folder Item",
  description: "Move an item (design, image asset, folder, or brand template) into a target folder via POST /folders/move. Video assets are not supported by this endpoint and will be rejected. [See the documentation](https://www.canva.dev/docs/connect/api-reference/folders/move-folder-item/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    canva,
    toFolderId: {
      type: "string",
      label: "Destination Folder ID",
      description: "Destination folder ID (maps to `to_folder_id`). Use `root` for top level. Discover IDs via **List Folder Items**.",
    },
    itemId: {
      type: "string",
      label: "Item ID",
      description: "ID of the item to move (maps to `item_id`, e.g. a design ID `DAFq1234abcd`). Discover IDs via **List Folder Items**.",
    },
  },
  async run({ $ }) {
    const response = await this.canva.moveFolderItem({
      $,
      data: {
        to_folder_id: this.toFolderId,
        item_id: this.itemId,
      },
    });
    $.export("$summary", `Successfully moved item "${this.itemId}" to folder "${this.toFolderId}"`);
    return response;
  },
};

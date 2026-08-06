// x-pd-ai: optimized
import app from "../../box.app.mjs";

export default {
  key: "box-delete-folder",
  name: "Delete Folder",
  description: "Deletes a folder by moving it to trash (or permanently when enterprise settings require). Set Recursive to `true` to delete non-empty folders and all contents; without it, deleting a non-empty folder fails. This cannot be undone from this action — use **List Folder Items** to verify contents first. [See the documentation](https://developer.box.com/reference/delete-folders-id/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    folderId: {
      propDefinition: [
        app,
        "parentId",
      ],
      label: "Folder",
      description: "The folder to delete (e.g. `123456789`). Cannot delete the root folder (`0`). Use the **List Folders** action to retrieve folder IDs.",
      optional: false,
    },
    recursive: {
      type: "boolean",
      label: "Recursive",
      description: "Delete a folder that is not empty by recursively deleting the folder and its contents",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    await this.app.deleteFolder({
      $,
      folderId: this.folderId,
      params: {
        recursive: this.recursive,
      },
    });

    $.export("$summary", `Successfully deleted folder ${this.folderId}`);
    return {
      success: true,
      folderId: this.folderId,
    };
  },
};

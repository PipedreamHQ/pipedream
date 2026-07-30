import app from "../../box.app.mjs";

export default {
  key: "box-delete-folder",
  name: "Delete Folder",
  description: "Deletes a folder, either permanently or by moving it to the trash. Set `recursive` to `true` to delete non-empty folders. [See the documentation](https://developer.box.com/reference/delete-folders-id/).",
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
      description: "The folder to delete",
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

import common from "../common/folder-props.mjs";

export default {
  ...common,
  key: "clickup-delete-folder",
  name: "Delete Folder",
  description: "Delete a folder. See the docs [here](https://clickup.com/api) in **Folders / Delete Folder** section.",
  version: "0.0.8",
  type: "action",
  async run({ $ }) {
    const { folderId } = this;

    const response = await this.clickup.deleteFolder({
      $,
      folderId,
    });

    $.export("$summary", "Successfully deleted folder");

    return response;
  },
};

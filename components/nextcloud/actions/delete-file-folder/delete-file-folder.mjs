import nextcloud from "../../nextcloud.app.mjs";

export default {
  key: "nextcloud-delete-file-folder",
  name: "Delete File or Folder",
  description: "Deletes a specific file or folder in Nextcloud. Be careful, as deleted files cannot be restored.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    nextcloud,
    path: {
      propDefinition: [
        nextcloud,
        "path",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.nextcloud.deleteFileOrFolder({
      path: this.path,
    });
    $.export("$summary", `File or folder at ${this.path} has been deleted successfully.`);
    return response;
  },
};

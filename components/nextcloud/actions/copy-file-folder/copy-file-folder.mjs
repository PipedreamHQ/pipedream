import nextcloud from "../../nextcloud.app.mjs";

export default {
  key: "nextcloud-copy-file-folder",
  name: "Copy File or Folder",
  description: "Copies a specific file or folder in Nextcloud. [See the documentation](https://docs.nextcloud.com/server/latest/developer_manual/client_apis/index.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    nextcloud,
    sourcePath: nextcloud.propDefinitions.sourcePath,
    destinationPath: nextcloud.propDefinitions.destinationPath,
    overwrite: {
      ...nextcloud.propDefinitions.overwrite,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      sourcePath, destinationPath, overwrite,
    } = this;
    const response = await this.nextcloud.copyFileOrFolder({
      sourcePath,
      destinationPath,
      overwrite,
    });

    $.export("$summary", `Successfully copied ${sourcePath} to ${destinationPath}`);
    return response;
  },
};

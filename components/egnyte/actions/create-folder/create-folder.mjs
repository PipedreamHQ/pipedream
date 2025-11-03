import egnyte from "../../egnyte.app.mjs";

export default {
  key: "egnyte-create-folder",
  name: "Create Folder",
  description: "Creates a new folder in your Egnyte workspace. [See the documentation](https://developers.egnyte.com/docs/File_System_Management_API_Documentation#Create-a-Folder)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    egnyte,
    folderPath: {
      type: "string",
      label: "Folder Path",
      description: "The full path to the new folder. Example: `/Shared/test`",
    },
  },
  async run({ $ }) {
    const folderPath = this.folderPath[0] === "/"
      ? this.folderPath.slice(1)
      : this.folderPath;
    const response = await this.egnyte.createFolder({
      $,
      folderPath,
    });
    $.export("$summary", `Created folder "${this.folderPath}"`);
    return response;
  },
};

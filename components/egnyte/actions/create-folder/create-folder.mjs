import egnyte from "../../egnyte.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "egnyte-create-folder",
  name: "Create Folder",
  description: "Creates a new folder in your Egnyte workspace. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    egnyte,
    newFolderName: {
      propDefinition: [
        egnyte,
        "newFolderName",
      ],
    },
    parentFolderId: {
      propDefinition: [
        egnyte,
        "parentFolderId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.egnyte.createFolder({
      folderName: this.newFolderName,
      parentFolderId: this.parentFolderId,
    });
    $.export("$summary", `Created folder "${this.newFolderName}"`);
    return response;
  },
};

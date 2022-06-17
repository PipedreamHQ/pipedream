import pcloud from "../../pcloud.app.mjs";

export default {
  key: "pcloud-create-folder",
  name: "Create Folder",
  description: "Create a folder in the specified folder.",
  version: "0.0.1",
  type: "action",
  props: {
    pcloud,
    // this should not be optional
    name: {
      propDefinition: [
        pcloud,
        "name",
      ],
    },
    folderId: {
      propDefinition: [
        pcloud,
        "folderId",
      ],
      label: "Parent Folder ID",
      description: "ID of the parent folder where the new folder will be created.",
    },
  },
  async run() {
    return await this.pcloud._withRetries(
      () => this.pcloud.createFolder(
        this.name,
        this.folderId,
      ),
    );
  },
};

import pcloud from "../../pcloud.app.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "pcloud-create-folder",
  name: "Create Folder",
  description: "Create a folder in the specified folder.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
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
      description:
        "ID of the parent folder where the new folder will be created.",
    },
  },
  async run({ $ }) {
    const response = await this.pcloud._withRetries(() =>
      this.pcloud.createFolder(this.name, this.folderId));

    $.export("$summary", `Created folder "${this.name}" successfully`);

    return response;
  },
};

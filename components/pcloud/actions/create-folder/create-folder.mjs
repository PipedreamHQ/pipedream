import common from "../common/base.mjs";
import {
  folderId, name,
} from "../../props.mjs";

export default {
  ...common,
  key: "pcloud-create-folder",
  name: "Create Folder",
  description: "Create a folder in the specified folder.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    folderId: {
      ...folderId,
      label: "Parent Folder ID",
      description:
        "ID of the parent folder where the new folder will be created.",
    },
    name,
  },
  async run({ $ }) {
    const response = await this.pcloud._withRetries(() =>
      this.pcloud.createFolder(this.name, this.folderId));

    $.export("$summary", `Created folder "${this.name}" successfully`);

    return response;
  },
};

import common from "../common/base.mjs";
import { name } from "../../props.mjs";
import { propFolderId } from "../../props-custom-descriptions.mjs";

export default {
  ...common,
  key: "pcloud-create-folder",
  name: "Create Folder",
  description: "Create a folder in the specified folder. [See the docs here](https://docs.pcloud.com/methods/folder/createfolder.html)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    folderId: {
      ...propFolderId(" to create the new folder within"),
      label: "Parent Folder ID",
    },
    name,
  },
  methods: {
    ...common.methods,
    getSummary() {
      return `Created folder "${this.name}" successfully`;
    },
    async requestMethod() {
      return this.pcloud.createFolder(this.name, this.folderId);
    },
  },
};

import pcloud from "../../pcloud.app.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "pcloud-create-folder",
  name: "Create Folder",
  description:
    "Create a folder in the specified folder. [See the docs here](https://docs.pcloud.com/methods/folder/createfolder.html)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    folderId: {
      propDefinition: [
        pcloud,
        "folderId",
      ],
      description: `Select a **Folder** to create the new folder within.
        \\
        Alternatively, you can provide a custom *Folder ID*.`,
      label: "Parent Folder ID",
    },
    name: {
      propDefinition: [
        pcloud,
        "name",
      ],
    },
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

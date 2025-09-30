import pcloud from "../../pcloud.app.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "pcloud-rename-folder",
  name: "Rename Folder",
  description: "Renames a folder. [See the docs here](https://docs.pcloud.com/methods/folder/renamefolder.html)",
  version: "0.0.3",
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
      description: `Select a **Folder** to rename.
        \\
        Alternatively, you can provide a custom *Folder ID*.`,
    },
    toName: {
      propDefinition: [
        pcloud,
        "name",
      ],
      label: "New Folder Name",
      description: "New name of the folder.",
    },
  },
  methods: {
    ...common.methods,
    getSummary() {
      return `Successfully renamed folder to ${this.toName}`;
    },
    async requestMethod() {
      return this.pcloud.renameFolder(
        this.folderId,
        this.toName,
      );
    },
  },
};

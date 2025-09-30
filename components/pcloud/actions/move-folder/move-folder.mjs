import pcloud from "../../pcloud.app.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "pcloud-move-folder",
  name: "Move Folder",
  description: "Moves a folder to the specified destination. [See the docs here](https://docs.pcloud.com/methods/folder/renamefolder.html)",
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
      description: `Select a **Folder** to move.
        \\
        Alternatively, you can provide a custom *Folder ID*.`,
    },
    toFolderId: {
      propDefinition: [
        pcloud,
        "folderId",
      ],
      label: "Destination Folder ID",
      description: `Select a **Destination Folder** to put the folder.
        \\
        Alternatively, you can provide a custom *Folder ID*.`,
    },
  },
  methods: {
    ...common.methods,
    getSummary() {
      return "Moved folder successfully";
    },
    async requestMethod() {
      return this.pcloud.moveFolder(
        this.folderId,
        this.toFolderId,
      );
    },
  },
};

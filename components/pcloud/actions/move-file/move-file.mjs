import pcloud from "../../pcloud.app.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "pcloud-move-file",
  name: "Move File",
  description: "Moves a file to the specified destination. [See the docs here](https://docs.pcloud.com/methods/file/renamefile.html)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    fileId: {
      propDefinition: [
        pcloud,
        "fileId",
      ],
      description: `Select a **File** to move.
        \\
        Alternatively, you can provide a custom *File ID*.`,
    },
    toFolderId: {
      propDefinition: [
        pcloud,
        "folderId",
      ],
      label: "Destination Folder ID",
      description: `Select a **Destination Folder** to put the file.
        \\
        Alternatively, you can provide a custom *Folder ID*.`,
    },
  },
  methods: {
    ...common.methods,
    getSummary() {
      return "Moved file successfully";
    },
    async requestMethod() {
      return this.pcloud.moveFile(
        this.fileId,
        this.toFolderId,
      );
    },
  },
};

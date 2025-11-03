import pcloud from "../../pcloud.app.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "pcloud-rename-file",
  name: "Rename File",
  description: "Renames a file. [See the docs here](https://docs.pcloud.com/methods/file/renamefile.html)",
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
      description: `Select a **File** to rename.
        \\
        Alternatively, you can provide a custom *File ID*.`,
    },
    toName: {
      propDefinition: [
        pcloud,
        "name",
      ],
      label: "New File Name",
      description: "New name of the file.",
    },
  },
  methods: {
    ...common.methods,
    getSummary() {
      return `Successfully renamed file to ${this.toName}`;
    },
    async requestMethod() {
      return this.pcloud.renameFile(
        this.fileId,
        this.toName,
      );
    },
  },
};

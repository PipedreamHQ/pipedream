import pcloud from "../../pcloud.app.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "pcloud-list-contents",
  name: "List Contents",
  description: "Get the contents of the specified folder. [See the docs here](https://docs.pcloud.com/methods/folder/listfolder.html)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    folderId: {
      propDefinition: [
        pcloud,
        "folderId",
      ],
      description: `Select a **Folder** to get the contents of.
        \\
        Alternatively, you can provide a custom *Folder ID*.`,
    },
    recursive: {
      type: "boolean",
      label: "Recursive?",
      description:
        "If true, returns contents of the folder **and all subfolders,** recursively.",
      default: false,
    },
    showDeleted: {
      propDefinition: [
        pcloud,
        "showDeleted",
      ],
    },
    noFiles: {
      type: "boolean",
      label: "Folders Only?",
      description:
        "If true, only the **folder** (sub)structure will be returned.",
      default: false,
    },
    noShares: {
      type: "boolean",
      label: "Exclude Shares?",
      description: "If true, excludes shared files and folders.",
      default: true,
    },
  },
  methods: {
    ...common.methods,
    getSummary() {
      return "Listed folder contents successfully";
    },
    async requestMethod() {
      return this.pcloud.listContents(
        this.folderId,
        this.recursive,
        this.showDeleted,
        this.noFiles,
        this.noShares,
      );
    },
  },
};

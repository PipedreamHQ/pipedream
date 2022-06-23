import common from "../common/base.mjs";
import { showDeleted } from "../../props.mjs";
import { propFolderId } from "../../props-custom-descriptions.mjs";

export default {
  ...common,
  key: "pcloud-list-contents",
  name: "List Contents",
  description: "Get the contents of the specified folder.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    folderId: propFolderId(" to get the contents of"),
    recursive: {
      type: "boolean",
      label: "Recursive?",
      description:
        "If true, returns contents of the folder **and all subfolders,** recursively.",
      default: false,
    },
    showDeleted,
    noFiles: {
      type: "boolean",
      label: "No Files?",
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

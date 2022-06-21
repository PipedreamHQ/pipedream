import common from "../common/base.mjs";
import {
  folderId, showDeleted,
} from "../common/props.mjs";

export default {
  ...common,
  key: "pcloud-list-contents",
  name: "List Contents",
  description: "Get the contents of the specified folder.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    folderId: {
      ...folderId,
      description: "ID of the folder to list contents.",
    },
    recursive: {
      type: "boolean",
      label: "Recursive?",
      description: "If true, returns contents of the folder **and all subfolders,** recursively.",
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
  async run({ $ }) {
    const response = await this.pcloud._withRetries(
      () => this.pcloud.listContents(
        this.folderId,
        this.recursive,
        this.showDeleted,
        this.noFiles,
        this.noShares,
      ),
    );

    $.export("$summary", "Listed folder contents successfully");

    return response;
  },
};

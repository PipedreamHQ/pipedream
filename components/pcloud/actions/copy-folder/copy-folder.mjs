import pcloud from "../../pcloud.app.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "pcloud-copy-folder",
  name: "Copy Folder",
  description: "Copy a folder to the specified folder.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    folderId: {
      propDefinition: [
        pcloud,
        "folderId",
      ],
      description: "ID of the source folder.",
    },
    toFolderId: {
      propDefinition: [
        pcloud,
        "toFolderId",
      ],
    },
    overwrite: {
      type: "boolean",
      label: "Overwrite?",
      description:
        "Overwrite existing file if one exists. Otherwise, will return a `2004` error code.",
      default: false,
    },
    copyContentOnly: {
      type: "boolean",
      label: "Copy Content Only?",
      description:
        "If it is set only the content of source folder will be copied otherwise the folder itself is copied.",
      default: false,
    },
  },
  async run({ $ }) {
    const response = await this.pcloud._withRetries(
      () => this.pcloud.copyFolder(
        this.folderId,
        this.toFolderId,
        !this.overwrite,
        this.copyContentOnly,
      ),
    );

    $.export("$summary", "Copied folder successfully");

    return response;
  },
};

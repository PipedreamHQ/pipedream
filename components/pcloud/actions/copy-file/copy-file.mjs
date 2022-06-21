import common from "../common/base.mjs";
import {
  fileId, toFolderId, name, overwrite,
} from "../common/props.mjs";

export default {
  ...common,
  key: "pcloud-copy-file",
  name: "Copy File",
  description: "Copy a file to the specified destination.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    fileId,
    toFolderId,
    name: {
      ...name,
      label: "To Name",
      description: "Name of the destination file.",
    },
    overwrite,
    modifiedTime: {
      type: "integer",
      label: "Modified Time",
      description: "Must be Unix time (seconds).",
      optional: true,
    },
    createdTime: {
      type: "integer",
      label: "Created Time",
      description: `Must be Unix time (seconds).
      \\
      Requires \`Modified Time\` to be set.`,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pcloud._withRetries(() =>
      this.pcloud.copyFile(
        this.fileId,
        this.toFolderId,
        this.name,
        !this.overwrite,
        this.modifiedTime,
        this.createdTime,
      ));

    $.export("$summary", `Copied file "${this.name}" successfully`);

    return response;
  },
};

import pcloud from "../../pcloud.app.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "pcloud-copy-file",
  name: "Copy File",
  description:
    "Copy a file to the specified destination. [See the docs here](https://docs.pcloud.com/methods/file/copyfile.html)",
  version: "0.0.5",
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
      description: `Select a **File** to copy.
        \\
        Alternatively, you can provide a custom *File ID*.`,
    },
    toFolderId: {
      propDefinition: [
        pcloud,
        "folderId",
      ],
      label: "Destination Folder ID",
      description: `Select a **Destination Folder** to receive the copied file.
        \\
        Alternatively, you can provide a custom *Folder ID*.`,
    },
    name: {
      propDefinition: [
        pcloud,
        "name",
      ],
      label: "New File Name",
      description: "Name of the destination file.",
    },
    overwrite: {
      propDefinition: [
        pcloud,
        "overwrite",
      ],
    },
    modifiedTime: {
      propDefinition: [
        pcloud,
        "modifiedTime",
      ],
    },
    createdTime: {
      propDefinition: [
        pcloud,
        "createdTime",
      ],
    },
  },
  methods: {
    ...common.methods,
    getSummary() {
      return `Copied file "${this.name}" successfully`;
    },
    async requestMethod() {
      return this.pcloud.copyFile(
        this.fileId,
        this.toFolderId,
        this.name,
        !this.overwrite,
        this.modifiedTime,
        this.createdTime,
      );
    },
  },
};

import common from "../common/base.mjs";
import {
  name, overwrite, modifiedTime, createdTime,
} from "../../props.mjs";
import {
  propFileId,
  propToFolderId,
} from "../../props-custom-descriptions.mjs";

export default {
  ...common,
  key: "pcloud-copy-file",
  name: "Copy File",
  description: "Copy a file to the specified destination. [See the docs here](https://docs.pcloud.com/methods/file/copyfile.html)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    fileId: propFileId(" to copy"),
    toFolderId: propToFolderId(" to receive the copied file"),
    name: {
      ...name,
      label: "New File Name",
      description: "Name of the destination file.",
    },
    overwrite,
    modifiedTime,
    createdTime,
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

import common from "../common/base.mjs";
import {
  name, modifiedTime, createdTime,
} from "../../props.mjs";
import { propFolderId } from "../../props-custom-descriptions.mjs";
import { promises as fsPromises } from "fs";

export default {
  ...common,
  key: "pcloud-upload-file",
  name: "Upload File",
  description: "Upload a file to the specified folder. [See the docs here](https://docs.pcloud.com/methods/file/uploadfile.html)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    folderId: propFolderId(" to receive the uploaded files"),
    name: {
      ...name,
      description: `Name of the file to upload. This must be a file in the workflow's \`/tmp\` directory.
        \\
        [See the docs on how to work with files in your workflow.](https://pipedream.com/docs/code/nodejs/working-with-files/)`,
    },
    renameIfExists: {
      type: "boolean",
      label: "Rename if Exists",
      description:
        "If true, the uploaded file will be renamed, if another file with the requested name already exists in the specified folder.",
      default: true,
    },
    modifiedTime,
    createdTime,
  },
  methods: {
    ...common.methods,
    async validateInputs() {
      const files = await fsPromises.readdir("/tmp");
      const fileName = this.name;

      if (!files.includes(fileName)) {
        return `File "${this.name}" not found in the /tmp directory`;
      }

      return true;
    },
    getSummary() {
      return `Uploaded file "${this.name}" successfully`;
    },
    async requestMethod() {
      return this.pcloud.uploadFile(
        this.folderId,
        this.name,
        this.noPartial,
        this.progressHash,
        this.renameIfExists,
        this.modifiedTime,
        this.createdTime,
      );
    },
  },
};

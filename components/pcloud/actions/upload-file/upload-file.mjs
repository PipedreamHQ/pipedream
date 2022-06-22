import common from "../common/base.mjs";
import {
  name, modifiedTime, createdTime,
} from "../../props.mjs";
import { propFolderId } from "../../props-custom-descriptions.mjs";

export default {
  ...common,
  key: "pcloud-upload-file",
  name: "Upload File",
  description: "Upload a file to the specified folder.",
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
  async run({ $ }) {
    const response = await this.pcloud._withRetries(
      () => this.pcloud.uploadFile(
        this.folderId,
        this.name,
        this.noPartial,
        this.progressHash,
        this.renameIfExists,
        this.modifiedTime,
        this.createdTime,
      ),
    );

    $.export("$summary", `Uploaded file "${this.name}" successfully`);

    return response;
  },
};

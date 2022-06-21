import pcloud from "../../pcloud.app.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "pcloud-upload-file",
  name: "Upload File",
  description: "Upload a file to the specified folder.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    folderId: {
      propDefinition: [
        pcloud,
        "folderId",
      ],
      description:
        "ID of the folder where the file will be uploaded. If not specified, the root folder will be used.",
    },
    name: {
      propDefinition: [
        pcloud,
        "name",
      ],
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
    mtime: {
      type: "integer",
      label: "Modified Time",
      description: "Must be Unix time (seconds).",
      optional: true,
    },
    ctime: {
      type: "integer",
      label: "Created Time",
      description: `Must be Unix time (seconds).
      \\
      Requires \`Modified Time\` to be set.`,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pcloud._withRetries(
      () => this.pcloud.uploadFile(
        this.folderId,
        this.name,
        this.noPartial,
        this.progressHash,
        this.renameIfExists,
        this.mtime,
        this.ctime,
      ),
    );

    $.export("$summary", `Uploaded file "${this.name}" successfully`);

    return response;
  },
};

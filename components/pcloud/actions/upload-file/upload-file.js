const pcloud = require("../../pcloud.app.js");

module.exports = {
  key: "pcloud-upload-file",
  name: "Upload File",
  description:
    "Uploads a file to the specified folder.",
  version: "0.0.1",
  type: "action",
  props: {
    pcloud,
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
      description:
        "Name of the file to upload. Within the associated Pipedream workflow, the file to upload exist under the `/tmp` directory.",
    },
    renameIfExists: {
      type: "boolean",
      label: "Rename if Exists",
      description:
        "If set, the uploaded file will be renamed, if file with the requested name exists in the folder.",
      default: true,
    },
    mtime: {
      type: "integer",
      label: "Modified Time",
      description:
        "Must be a UNIX timestamp",
      optional: true,
    },
    ctime: {
      type: "integer",
      label: "Modified Time",
      description:
        "Must be a UNIX timestamp.",
      optional: true,
    },
  },
  async run() {
    return await this.pcloud._withRetries(
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
  },
};

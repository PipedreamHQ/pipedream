const pcloud = require("../../pcloud.app");

module.exports = {
  key: "pcloud-upload-file",
  name: "Upload File",
  description: "Uploads a file to the specified folder in the `folderId` or `path` parameters.",
  version: "0.0.14",
  type: "action",
  props: {
    pcloud,
    domainLocation: { propDefinition: [pcloud, "domainLocation"] },
    path: {
      type: "string",
      label: "Path",
      description:
        "Path to the folder where the file will be uploaded (discouraged). If neither `path` nor `folderid` are specified, the root folder will be used.",
      optional: true,
    },
    folderId: {
      type: "integer",
      label: "Folder Id",
      description:
        "Id of the folder where the file will be uploaded. If neither `path` nor `folderid` are specified, the root folder will be used.",
      optional: true,
    },
    file: {
      type: "string",
      label: "Files",
      description: "Base64 content of the file.",
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "Name of the file to upload.",
    },
  },
  methods: {
  },
  async run() {
    return await this.pcloud.uploadFiles(
      this.path,
      this.folderId,
      this.file,
      this.filename
    );
  },
};

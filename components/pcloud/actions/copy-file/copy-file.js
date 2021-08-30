const common = require("../../common");
const { pcloud } = common.props;
const validate = require("validate.js");

module.exports = {
  key: "pcloud-copy-file",
  name: "Copy File",
  description:
    "Takes one file and copies it as another file in the user's filesystem.",
  version: "0.0.1",
  type: "action",
  props: {
    pcloud,
    domainLocation: {
      propDefinition: [
        pcloud,
        "domainLocation",
      ],
    },
    fileId: {
      type: "integer",
      label: "File ID",
      description: "ID of the file to copy.",
      optional: true,
    },
    path: {
      propDefinition: [
        pcloud,
        "path",
      ],
      description: "Path to the file to copy.",
    },
    toFolderId: {
      propDefinition: [
        pcloud,
        "toFolderId",
      ],
    },
    toPath: {
      propDefinition: [
        pcloud,
        "toPath",
      ],
      description: "Destination path, including the filename. A new filename can be used. When this is used `toName` is ignored.",
    },
    name: {
      propDefinition: [
        pcloud,
        "name",
      ],
      label: "To Name",
      description: "Name of the destination file. This is used only if the destination folder is specified with `toFolderId`.",
    },
    noOver: {
      propDefinition: [
        pcloud,
        "noOver",
      ],
    },
    modifiedTime: {
      type: "integer",
      label: "Modified Time",
      description: "Must be a UNIX timestamp.",
      optional: true,
    },
    createdTime: {
      type: "integer",
      label: "Created Time",
      description: "Must be a UNIX timestamp.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const constraints = {
      domainLocation: {
        presence: true,
      },
    };
    const validationResult = validate(
      {
        domainLocation: this.domainLocation,
      },
      constraints,
    );
    if (validationResult) {
      const validationMessages = this.getValidationMessage(validationResult);
      throw new Error(validationMessages);
    }
    return await this.pcloud.copyFile(
      this.domainLocation,
      this.fileId,
      this.path,
      this.toFolderId,
      this.toPath,
      this.name,
      this.noOver,
      this.modifiedTime,
      this.createdTime,
    );
  },
};

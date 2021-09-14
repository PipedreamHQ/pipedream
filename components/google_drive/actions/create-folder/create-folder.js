const googleDrive = require("../../google_drive.app");

module.exports = {
  key: "google_drive-create-folder",
  name: "Create Folder",
  description: "Create a new empty folder",
  version: "0.0.12",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive you want to create the folder in.",
    },
    parentId: {
      propDefinition: [
        googleDrive,
        "folderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The folder you want to create the folder in.",
      optional: true,
      default: "",
    },
    name: {
      propDefinition: [
        googleDrive,
        "fileName",
      ],
      label: "Name",
      description: "The name of the new folder.",
      optional: true,
      default: "",
    },
  },
  async run() {
    const {
      parentId,
      name = undefined,
    } = this;
    return await this.googleDrive.createFolder({
      name,
      parentId,
    });
  },
};

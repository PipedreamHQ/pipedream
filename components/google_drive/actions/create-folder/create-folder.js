const googleDrive = require("../../google_drive.app");

module.exports = {
  key: "google_drive-create-folder",
  name: "Create Folder",
  description: "Create a new empty folder",
  version: "0.0.1",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description:
        "The drive to use. If not specified, your personal Google Drive will be used. If you are connected with any [Google Shared Drives](https://support.google.com/a/users/answer/9310351), you can select it here.",
      optional: true,
    },
    parentId: {
      propDefinition: [
        googleDrive,
        "folderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description:
        "Select a folder in which to place the new folder. If not specified, the folder will be placed directly in the user's My Drive folder.",
      optional: true,
    },
    name: {
      propDefinition: [
        googleDrive,
        "fileName",
      ],
      label: "Name",
      description: "The name of the new folder",
      optional: true,
    },
  },
  async run() {
    const {
      parentId,
      name,
    } = this;
    return await this.googleDrive.createFolder({
      name,
      parentId,
    });
  },
};

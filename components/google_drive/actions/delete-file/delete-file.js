const googleDrive = require("../../google_drive.app");

module.exports = {
  key: "google_drive-delete-file",
  name: "Delete File",
  description:
    "Permanently delete a file or folder without moving it to the trash",
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
    fileId: {
      propDefinition: [
        googleDrive,
        "fileOrFolderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The file or folder to delete",
    },
  },
  async run() {
    return await this.googleDrive.deleteFile(this.fileId);
  },
};

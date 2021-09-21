const googleDrive = require("../../google_drive.app");

module.exports = {
  key: "google_drive-move-file",
  name: "Move File",
  description: "Move a file from one folder to another",
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
    },
    fileId: {
      propDefinition: [
        googleDrive,
        "fileId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The file to move",
    },
    /* eslint-disable pipedream/default-value-required-for-optional-props */
    folderId: {
      propDefinition: [
        googleDrive,
        "folderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The folder you want to move the file to",
      optional: true,
    },
  },
  async run() {
    // Get file to get parents to remove
    const file = await this.googleDrive.getFile(this.fileId);
    // Update file, removing old parents, adding new parent folder
    return await this.googleDrive.updateFile(this.fileId, {
      fields: "*",
      removeParents: file.parents.join(","),
      addParents: this.folderId,
    });
  },
};

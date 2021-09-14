const googleDrive = require("../../google_drive.app");

module.exports = {
  key: "google_drive-move-file",
  name: "Move File",
  description: "Move a file from one folder to another",
  version: "0.0.2",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive containing the file to move.",
    },
    fileId: {
      propDefinition: [
        googleDrive,
        "fileId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The file to move.",
    },
    folderId: {
      propDefinition: [
        googleDrive,
        "folderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The folder you want to move the file to.",
      optional: true,
      default: "",
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

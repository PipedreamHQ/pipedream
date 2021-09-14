const googleDrive = require("../../google_drive.app");

module.exports = {
  key: "google_drive-delete-shared-drive",
  name: "Delete Shared Drive",
  description: "Delete a shared drive without any content",
  version: "0.0.2",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "Select a drive to delete.",
    },
  },
  async run() {
    return await this.googleDrive.deleteSharedDrive(
      this.googleDrive.getDriveId(this.drive),
    );
  },
};

const googleDrive = require("../../google_drive.app");

module.exports = {
  key: "google_drive-delete-shared-drive",
  name: "Delete Shared Drive",
  description: "Delete a shared drive without any content",
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
        "Select a [shared drive](https://support.google.com/a/users/answer/9310351) to delete.",
    },
  },
  async run() {
    return await this.googleDrive.deleteSharedDrive(
      this.googleDrive.getDriveId(this.drive),
    );
  },
};

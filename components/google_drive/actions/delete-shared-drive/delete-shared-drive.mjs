import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-delete-shared-drive",
  name: "Delete Shared Drive",
  description: "Delete a shared drive without any content. [See the docs](https://developers.google.com/drive/api/v3/reference/drives/delete) for more information",
  version: "0.0.3",
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
      default: "",
    },
  },
  async run({ $ }) {
    await this.googleDrive.deleteSharedDrive(
      this.googleDrive.getDriveId(this.drive),
    );
    $.export("$summary", "Successfully deleted the shared drive");
    return {
      success: true,
    };
  },
};

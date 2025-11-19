import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-delete-shared-drive",
  name: "Delete Shared Drive",
  description: "Delete a shared drive without any content. [See the documentation](https://developers.google.com/drive/api/v3/reference/drives/delete) for more information",
  version: "0.1.15",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "sharedDrive",
      ],
      description:
        "Select a [shared drive](https://support.google.com/a/users/answer/9310351) to delete.",
      optional: false,
    },
  },
  async run({ $ }) {
    const { drive } = this;
    await this.googleDrive.deleteSharedDrive(
      this.googleDrive.getDriveId(drive),
    );
    $.export("$summary", "Successfully deleted the shared drive");
    return {
      success: true,
      drive,
    };
  },
};

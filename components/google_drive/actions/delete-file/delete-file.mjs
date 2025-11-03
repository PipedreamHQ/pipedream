import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-delete-file",
  name: "Delete File",
  description:
    "Permanently delete a file or folder without moving it to the trash. [See the documentation](https://developers.google.com/drive/api/v3/reference/files/delete) for more information",
  version: "0.1.15",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleDrive,
    infoAlert: {
      type: "alert",
      alertType: "warning",
      content: "This action will **permanently** delete a file. If you want to move it to the trash instead, use the **[Move File to Trash](https://pipedream.com/apps/google-drive/actions/move-file-to-trash)** action.",
    },
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
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
  async run({ $ }) {
    const { fileId } = this;
    await this.googleDrive.deleteFile(fileId);
    $.export("$summary", `Successfully deleted file (ID: ${fileId}`);
    return {
      success: true,
      fileId,
    };
  },
};

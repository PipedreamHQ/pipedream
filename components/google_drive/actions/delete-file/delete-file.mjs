import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-delete-file",
  name: "Delete File",
  description:
    "Permanently delete a file or folder without moving it to the trash. [See the docs](https://developers.google.com/drive/api/v3/reference/files/delete) for more information",
  version: "0.0.5",
  type: "action",
  props: {
    googleDrive,
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
    await this.googleDrive.deleteFile(this.fileId);
    $.export("$summary", "Successfully deleted the file");
    return {
      success: true,
    };
  },
};

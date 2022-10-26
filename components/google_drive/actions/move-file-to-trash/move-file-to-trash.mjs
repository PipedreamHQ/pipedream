import googleDrive from "../../google_drive.app.mjs";
import { GOOGLE_DRIVE_FOLDER_MIME_TYPE } from "../../common/constants.mjs";

export default {
  key: "google_drive-move-file-to-trash",
  name: "Move File to Trash",
  description: "Move a file or folder to trash. [See the docs](https://developers.google.com/drive/api/v3/reference/files/update) for more information",
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
      description: "The file or folder to move to trash",
    },
  },
  async run({ $ }) {
    const resp = await this.googleDrive.updateFile(this.fileId, {
      requestBody: {
        trashed: true,
      },
    });
    $.export("$summary", `Successfully moved the ${resp.mimeType === GOOGLE_DRIVE_FOLDER_MIME_TYPE
      ? "folder"
      : "file"} "${resp.name}" to trash`);
    return resp;
  },
};

import { GOOGLE_DRIVE_FOLDER_MIME_TYPE } from "../../common/constants.mjs";
import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-move-file-to-trash",
  name: "Move File to Trash",
  description: "Move a file or folder to trash. [See the documentation](https://developers.google.com/drive/api/v3/reference/files/update) for more information",
  version: "0.1.16",
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
      alertType: "info",
      content: "If you want to **permanently** delete a file instead, use the **[Move File to Trash](https://pipedream.com/apps/google-drive/actions/delete-file)** action.",
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

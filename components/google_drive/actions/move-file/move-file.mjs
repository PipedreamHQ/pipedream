import { ConfigurationError } from "@pipedream/platform";
import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-move-file",
  name: "Move File",
  description: "Move a file from one folder to another. [See the documentation](https://developers.google.com/drive/api/v3/reference/files/update) for more information",
  version: "0.1.31",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
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
        "fileId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The file to move",
    },
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
  async run({ $ }) {
    // Get file to get parents to remove
    const file = await this.googleDrive.getFile(this.fileId);
    // Drive omits `parents` when the user can't see the file's current folder
    // (typical for shared files), and rejects any attempt to re-parent it.
    if (!file.parents?.length) {
      throw new ConfigurationError(
        `Cannot move "${file.name}": it isn't in a folder you can access (for example, it was shared with you from someone else's folder), so its current folder can't be replaced. Instead, create a shortcut to the file or make a copy of it in the destination folder.`,
      );
    }
    // Update file, removing old parents, adding new parent folder
    const resp = await this.googleDrive.updateFile(this.fileId, {
      fields: "*",
      removeParents: file.parents.join(","),
      addParents: this.folderId,
    });
    $.export("$summary", `Successfully moved the file, "${file.name}"`);
    return resp;
  },
};

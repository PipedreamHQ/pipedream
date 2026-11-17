import { ConfigurationError } from "@pipedream/platform";
import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-move-file",
  name: "Move File",
  description: "Move a file from its current folder to another folder. If the file's current folder isn't accessible to the user (for example, it was shared from someone else's folder), the file is added to the destination folder instead when Drive allows it; otherwise the action returns an error, and a shortcut or copy should be used. [See the documentation](https://developers.google.com/drive/api/v3/reference/files/update) for more information",
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
    // (typical for shared files). There is nothing to remove then, so the file
    // can only be added to the destination, and only if Drive says that is
    // allowed; otherwise it rejects the update (403 cannotAddParent).
    const hasParents = Boolean(file.parents?.length);
    if (!hasParents && !(file.capabilities?.canAddMyDriveParent && this.folderId)) {
      throw new ConfigurationError(
        `Cannot move "${file.name}": it isn't in a folder you can access (for example, it was shared with you from someone else's folder), so its current folder can't be replaced. Instead, create a shortcut to the file or make a copy of it in the destination folder.`,
      );
    }
    // Update file, removing old parents, adding new parent folder
    const resp = await this.googleDrive.updateFile(this.fileId, {
      fields: "*",
      removeParents: hasParents
        ? file.parents.join(",")
        : undefined,
      addParents: this.folderId,
    });
    $.export("$summary", hasParents
      ? `Successfully moved the file, "${file.name}"`
      : `Added the file, "${file.name}", to the destination folder (it had no accessible parent folder to remove)`);
    return resp;
  },
};

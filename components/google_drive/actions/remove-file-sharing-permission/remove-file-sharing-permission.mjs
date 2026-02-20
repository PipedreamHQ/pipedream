import { ConfigurationError } from "@pipedream/platform";
import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-remove-file-sharing-permission",
  name: "Remove File Sharing Permission",
  description:
    "Remove a [sharing permission](https://support.google.com/drive/answer/7166529) from the sharing preferences of a file or folder. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/permissions/delete)",
  version: "0.0.1",
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
        "watchedDrive",
      ],
      optional: true,
    },
    useFileOrFolder: {
      type: "string",
      label: "Use File or Folder",
      description: "Whether to use a file or a folder for this action",
      reloadProps: true,
      options: [
        "File",
        "Folder",
      ],
    },
    fileId: {
      propDefinition: [
        googleDrive,
        "fileId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      hidden: true,
      description: "The file to remove the sharing permission from. You must specify either a file or a folder.",
    },
    folderId: {
      propDefinition: [
        googleDrive,
        "folderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      hidden: true,
      description: "The folder to remove the sharing permission from. You must specify either a file or a folder.",
    },
    permissionId: {
      propDefinition: [
        googleDrive,
        "permissionId",
        (c) => ({
          fileId: c.fileId || c.folderId,
        }),
      ],
      description: "The ID of the permission to remove.",
    },
  },
  async additionalProps(previousProps) {
    const { useFileOrFolder } = this;

    if (useFileOrFolder === "File") {
      previousProps.fileId.hidden = false;
      previousProps.folderId.hidden = true;
    } else if (useFileOrFolder === "Folder") {
      previousProps.fileId.hidden = true;
      previousProps.folderId.hidden = false;
    }

    return {};
  },
  async run({ $ }) {
    const {
      fileId, folderId, permissionId,
    } = this;
    if (!(fileId || folderId)) {
      throw new ConfigurationError("You must specify either a file or a folder");
    }

    await this.googleDrive.deletePermission({
      fileId: fileId || folderId,
      permissionId,
    });

    $.export(
      "$summary",
      `Successfully removed permission for the ${folderId
        ? "folder"
        : "file"}`,
    );
    return {
      success: true,
      permissionId,
    };
  },
};

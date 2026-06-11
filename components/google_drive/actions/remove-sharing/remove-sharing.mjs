import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-remove-sharing",
  name: "Remove Sharing",
  description:
    "Remove a sharing permission from a file or folder in Google Drive."
    + " This revokes access for the specified permission."
    + " Use **List Permissions** first to find the permission ID to remove."
    + " The owner permission cannot be removed."
    + " Use **Search Files** to find the file ID by name if needed."
    + " [See the documentation](https://developers.google.com/drive/api/v3/reference/permissions/delete)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    googleDrive,
    fileId: {
      type: "string",
      label: "File ID",
      description:
        "The ID of the file or folder to remove the sharing permission from."
        + " Use **Search Files** to find the file ID by name.",
    },
    permissionId: {
      type: "string",
      label: "Permission ID",
      description:
        "The ID of the permission to remove."
        + " Use **List Permissions** to find the permission ID.",
    },
  },
  async run({ $ }) {
    await this.googleDrive.deletePermission({
      fileId: this.fileId,
      permissionId: this.permissionId,
    });

    $.export("$summary", `Removed permission ${this.permissionId} from file ${this.fileId}`);
    return {
      success: true,
      fileId: this.fileId,
      permissionId: this.permissionId,
    };
  },
};

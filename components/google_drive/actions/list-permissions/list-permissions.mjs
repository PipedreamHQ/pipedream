import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-list-permissions",
  name: "List Permissions",
  description:
    "List sharing permissions on a file or folder in Google Drive."
    + " Returns each permission's ID, type (user/group/domain/anyone), role (owner/writer/commenter/reader), and email address."
    + " Use **Search Files** first to find the file ID by name."
    + " Use this tool when the user asks 'who has access to this file?' or needs to audit sharing."
    + " Pass permission IDs from this response to **Remove Sharing** to revoke access."
    + " [See the documentation](https://developers.google.com/drive/api/v3/reference/permissions/list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    googleDrive,
    fileId: {
      type: "string",
      label: "File ID",
      description:
        "The ID of the file or folder to list permissions for."
        + " Use **Search Files** to find the file ID by name.",
    },
  },
  async run({ $ }) {
    const allPermissions = [];
    let pageToken;
    do {
      const {
        permissions = [], nextPageToken,
      } = await this.googleDrive.listPermissions(pageToken, this.fileId);
      allPermissions.push(...permissions);
      pageToken = nextPageToken;
    } while (pageToken);

    $.export("$summary", `Found ${allPermissions.length} permission${allPermissions.length === 1
      ? ""
      : "s"}`);
    return allPermissions;
  },
};

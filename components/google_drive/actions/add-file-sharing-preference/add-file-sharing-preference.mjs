import googleDrive from "../../google_drive.app.mjs";

/**
 * Uses Google Drive API to create a permission for a file. The role granted by
 * the permission is one of `owner`,`organizer`,`fileOrganizer`,
 * `writer`,`commenter`, `reader`. See the [Google Drive API Reference for
 * Permissions](https://bit.ly/2XKKG1X) for more information.
 */
export default {
  key: "google_drive-add-file-sharing-preference",
  name: "Add File Sharing Preference",
  description:
    "Add a [sharing](https://support.google.com/drive/answer/7166529) permission to the sharing preferences of a file or folder and provide a sharing URL. [See the docs](https://developers.google.com/drive/api/v3/reference/permissions/create) for more information",
  version: "0.1.2",
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
    fileOrFolderId: {
      propDefinition: [
        googleDrive,
        "fileOrFolderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      optional: false,
      description: "The file or folder to share",
    },
    role: {
      propDefinition: [
        googleDrive,
        "role",
      ],
    },
    type: {
      propDefinition: [
        googleDrive,
        "type",
      ],
    },
    domain: {
      propDefinition: [
        googleDrive,
        "domain",
      ],
    },
    emailAddress: {
      propDefinition: [
        googleDrive,
        "emailAddress",
      ],
    },
  },
  async run({ $ }) {
    const {
      fileOrFolderId,
      role,
      type,
      domain,
      emailAddress,
    } = this;
    // Create the permission for the file
    await this.googleDrive.createPermission(fileOrFolderId, {
      role,
      type,
      domain,
      emailAddress,
    });

    // Get the file to get the `webViewLink` sharing URL
    const resp = await this.googleDrive.getFile(this.fileOrFolderId);
    const webViewLink = resp.webViewLink;
    $.export("$summary", `Successfully added a sharing permission to the file, "${resp.name}"`);
    return webViewLink;
  },
};

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
    "Add a [sharing](https://support.google.com/drive/answer/7166529) permission to the sharing preferences of a file and provide a sharing URL. [See the docs](https://developers.google.com/drive/api/v3/reference/permissions/create) for more information",
  version: "0.0.1",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description:
        "The drive to use. If not specified, your personal Google Drive will be used. If you are connected with any [Google Shared Drives](https://support.google.com/a/users/answer/9310351), you can select it here.",
      optional: true,
    },
    fileId: {
      propDefinition: [
        googleDrive,
        "fileId",
        (c) => ({
          drive: c.drive,
          baseOpts: {
            q: "'me' in owners",
          },
        }),
      ],
      optional: false,
      description: "The file to share",
    },
    role: {
      type: "string",
      label: "Role",
      description: "The role granted by this permission",
      optional: true,
      default: "reader",
      options: [
        "owner",
        "organizer",
        "fileOrganizer",
        "writer",
        "commenter",
        "reader",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description:
        "The type of the grantee. If type is `user` or `group`, you must provide an `Email Address` for the user or group. When `type` is `domain`, you must provide a `Domain`. Sharing with a domain is only valid for G Suite users.",
      optional: true,
      default: "anyone",
      options: [
        "user",
        "group",
        "domain",
        "anyone",
      ],
    },
    domain: {
      type: "string",
      label: "Domain",
      description:
        "The domain of the G Suite organization to which this permission refers if `type` is `domain` (e.g., `yourcomapany.com`)",
      optional: true,
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description:
        "The email address of the user or group to which this permission refers if `type` is `user` or `group`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      fileId,
      role,
      type,
      domain,
      emailAddress,
    } = this;
    // Create the permission for the file
    await this.googleDrive.createPermission(fileId, {
      role,
      type,
      domain,
      emailAddress,
    });

    // Get the file to get the `webViewLink` sharing URL
    const resp = await this.googleDrive.getFile(this.fileId);
    const webViewLink = resp.webViewLink;
    $.export("$summary", `Successfully added a sharing permission to the file, "${resp.name}"`);
    return webViewLink;
  },
};

const googleDrive = require("../../google_drive.app");

module.exports = {
  key: "google_drive-add-file-sharing-preference",
  name: "Add File Sharing Preference",
  description:
    "Add a sharing permission to the sharing preferences of a file and provide a sharing URL",
  version: "0.0.1",
  type: "action",
  props: {
    googleDrive,
    /* eslint-disable pipedream/default-value-required-for-optional-props */
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
        "The type of the grantee. If type is `user` or `group`, you must provide an `Email Address` for the user or group. When `type` is `domain`, you must provide a `Domain`.",
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
        "The domain to which this permission refers if `type` is `domain`",
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
  async run() {
    const {
      fileId,
      role,
      type,
      domain,
      emailAddress,
    } = this;
    await this.googleDrive.createPermission(fileId, {
      role,
      type,
      domain,
      emailAddress,
    });

    return (await this.googleDrive.getFile(this.fileId)).webViewLink;
  },
};

import {
  GOOGLE_DRIVE_GRANTEE_DOMAIN,
  GOOGLE_DRIVE_GRANTEE_GROUP,
  GOOGLE_DRIVE_GRANTEE_USER,
  GOOGLE_DRIVE_ROLE_OPTIONS,
} from "../../common/constants.mjs";
import googleDrive from "../../google_drive.app.mjs";

/**
 * Uses Google Drive API to create a permission for a file. The role granted by
 * the permission is one of `owner`,`organizer`,`fileOrganizer`,
 * `writer`,`commenter`, `reader`. See the [Google Drive API Reference for
 * Permissions](https://bit.ly/2XKKG1X) for more information.
 */
export default {
  key: "google_drive-add-file-sharing-preference",
  name: "Share File",
  description:
    "Add a [sharing permission](https://support.google.com/drive/answer/7166529) to the sharing preferences of a file or folder and provide a sharing URL. [See the documentation](https://developers.google.com/drive/api/v3/reference/permissions/create)",
  version: "0.1.5",
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
    type: {
      propDefinition: [
        googleDrive,
        "type",
      ],
      reloadProps: true,
    },
  },
  additionalProps() {
    const obj = {};
    const emailAddress = {
      type: "string",
      label: "Email Address",
      description:
        "Enter the email address of the user that you'd like to share the file or folder with (e.g. `alex@altostrat.com`).",
    };

    switch (this.type) {
    case GOOGLE_DRIVE_GRANTEE_DOMAIN:
      obj.domain = {
        type: "string",
        label: "Domain",
        description:
            "Enter the domain of the G Suite organization that you'd like to share the file or folder with (e.g. `altostrat.com`). All G Suite organization users under this domain will have access to the file you share.",
      };
      break;
    case GOOGLE_DRIVE_GRANTEE_GROUP:
      obj.emailAddress = {
        ...emailAddress,
        description:
            "Enter the email address of the group that you'd like to share the file or folder with (e.g. `hiking-club@altostrat.com`)",
      };
      break;
    case GOOGLE_DRIVE_GRANTEE_USER:
      obj.emailAddress = emailAddress;
      break;

    default:
      break;
    }

    return {
      ...obj,
      role: {
        type: "string",
        label: "Role",
        description: "The role granted by this permission",
        options: GOOGLE_DRIVE_ROLE_OPTIONS,
      },
    };
  },
  async run({ $ }) {
    const {
      fileOrFolderId, role, type, domain, emailAddress,
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
    $.export(
      "$summary",
      `Successfully shared file "${resp.name}" with ${this.type} "${
        this.emailAddress ?? this.domain ?? ""
      }"`,
    );
    return webViewLink;
  },
};

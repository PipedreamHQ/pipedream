import { ConfigurationError } from "@pipedream/platform";
import {
  GOOGLE_DRIVE_GRANTEE_DOMAIN,
  GOOGLE_DRIVE_GRANTEE_GROUP,
  GOOGLE_DRIVE_GRANTEE_USER,
  GOOGLE_DRIVE_ROLE_OPTIONS,
  GOOGLE_DRIVE_ROLE_OPTION_FILEORGANIZER,
  GOOGLE_DRIVE_ROLE_WRITER,
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
  name: "Share File or Folder",
  description:
    "Add a [sharing permission](https://support.google.com/drive/answer/7166529) to the sharing preferences of a file or folder and provide a sharing URL. [See the documentation](https://developers.google.com/drive/api/v3/reference/permissions/create)",
  version: "0.2.8",
  annotations: {
    destructiveHint: false,
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
      description: "The file to share. You must specify either a file or a folder.",
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
      description: "The folder to share. You must specify either a file or a folder.",
    },
    type: {
      propDefinition: [
        googleDrive,
        "type",
      ],
      reloadProps: true,
    },
  },
  async additionalProps(previousProps) {
    const {
      fileId, folderId, type, useFileOrFolder,
    } = this;

    if (useFileOrFolder === "File") {
      previousProps.fileId.hidden = false;
      previousProps.folderId.hidden = true;
    } else if (useFileOrFolder === "Folder") {
      previousProps.fileId.hidden = true;
      previousProps.folderId.hidden = false;
    }

    const obj = {};
    if (!(fileId || folderId) || !type) return obj;

    const emailAddress = {
      type: "string",
      label: "Email Address",
      description:
        "Enter the email address of the user that you'd like to share the file or folder with (e.g. `alex@altostrat.com`).",
    };

    switch (type) {
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

    const isFolder = !!folderId;
    const options = GOOGLE_DRIVE_ROLE_OPTIONS;

    if (isFolder) {
      const writerOpt = options.find(({ value }) => value === GOOGLE_DRIVE_ROLE_WRITER);
      writerOpt.label = writerOpt.label.replace(/Writer/, "Contributor");
      options.push(GOOGLE_DRIVE_ROLE_OPTION_FILEORGANIZER);
    }

    return {
      ...obj,
      role: {
        type: "string",
        label: "Role",
        description: "The role granted by this permission",
        options,
      },
    };
  },
  async run({ $ }) {
    const {
      fileId, folderId, role, type, domain, emailAddress,
    } = this;
    if (!(fileId || folderId)) {
      throw new ConfigurationError("You must specify either a file or a folder");
    }
    // Create the permission for the file
    await this.googleDrive.createPermission(folderId ?? fileId, {
      role,
      type,
      domain,
      emailAddress,
    });

    // Get the file to get the `webViewLink` sharing URL
    const resp = await this.googleDrive.getFile(folderId ?? fileId);
    const webViewLink = resp.webViewLink;
    $.export(
      "$summary",
      `Successfully shared ${folderId
        ? "folder"
        : "file"} "${resp.name}" with ${type} "${
        emailAddress ?? domain ?? ""
      }" with role '${role}'`,
    );
    return webViewLink;
  },
};

import {
  getListFilesOpts,
  toSingleLineString,
} from "../../common/utils.mjs";
import googleDrive from "../../google_drive.app.mjs";

import {
  GOOGLE_DRIVE_FOLDER_MIME_TYPE,
  MY_DRIVE_VALUE,
} from "../../common/constants.mjs";

export default {
  key: "google_drive-create-folder",
  name: "Create Folder",
  description: "Create a new empty folder. [See the documentation](https://developers.google.com/drive/api/v3/reference/files/create) for more information",
  version: "0.1.17",
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
    parentId: {
      propDefinition: [
        googleDrive,
        "folderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      label: "Parent Folder",
      description: toSingleLineString(`
        Select a folder in which to place the new folder.
        If not specified, the folder will be placed directly in the drive's top-level folder.
      `),
      optional: true,
    },
    name: {
      propDefinition: [
        googleDrive,
        "fileName",
      ],
      label: "Name",
      description: "The name of the new folder",
      optional: true,
    },
    createIfUnique: {
      type: "boolean",
      label: "Create Only If Filename Is Unique?",
      description: toSingleLineString(`
        If the folder already exists, **do not** create. This option defaults to \`false\` for
        backwards compatibility and to be consistent with default Google Drive behavior.
      `),
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const {
      drive,
      parentId,
      name,
      createIfUnique,
    } = this;

    const driveId = await this.googleDrive.getDriveId(drive);

    if (createIfUnique) {
      let q = `mimeType = '${GOOGLE_DRIVE_FOLDER_MIME_TYPE}' and name = '${name}' and trashed = false`;
      if (parentId) {
        q += ` and '${parentId}' in parents`;
      } else if (drive === MY_DRIVE_VALUE) {
        q += " and 'root' in parents";
      } else {
        q += ` and '${driveId}' in parents`;
      }

      const opts = getListFilesOpts(driveId, {
        // Used for querying 'shared with me' folders that the user does not have direct access to
        // within a shared drive (e.g., when the user can't select the driveId of the shared drive).
        corpora: "user",
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        q,
      });

      const folders = (await this.googleDrive.listFilesInPage(null, opts)).files;

      if (folders.length) {
        $.export("$summary", "Found existing folder, therefore not creating folder. Returning found folder.");
        return this.googleDrive.getFile(folders[0].id);
      }
    }

    const resp = await this.googleDrive.createFolder({
      name,
      parentId,
      driveId,
    });
    $.export("$summary", `Successfully created a new folder, "${resp.name}"`);
    return resp;
  },
};

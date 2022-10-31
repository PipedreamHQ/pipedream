import googleDrive from "../../google_drive.app.mjs";
import {
  getListFilesOpts,
  toSingleLineString,
} from "../../utils.mjs";

import {
  MY_DRIVE_VALUE,
  GOOGLE_DRIVE_FOLDER_MIME_TYPE,
} from "../../constants.mjs";

export default {
  key: "google_drive-create-folder",
  name: "Create Folder",
  description: "Create a new empty folder. [See the docs](https://developers.google.com/drive/api/v3/reference/files/create) for more information",
  version: "0.0.7",
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
      const folders = (await this.googleDrive.listFilesInPage(null, getListFilesOpts(drive, {
        q,
      }))).files;

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

import googleDrive from "../../google_drive.app.mjs";
import {
  getListFilesOpts,
  toSingleLineString,
} from "../../common/utils.mjs";

import { GOOGLE_DRIVE_FOLDER_MIME_TYPE } from "../../common/constants.mjs";

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
      description:
        "Select a folder in which to place the new folder. If not specified, the folder will be placed directly in the drive's top-level folder.",
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
    createIfExists: {
      type: "boolean",
      label: "Create If Exists?",
      description: toSingleLineString(`
        If the folder already exists and is not in the trash, should we create it? This option defaults to 'true' for
        backwards compatibility and to be consistent with default Google Drive behavior.
      `),
      optional: true,
      default: true,
    },
  },
  async run({ $ }) {
    const {
      parentId,
      name,
      createIfExists,
    } = this;
    let folder;
    if (createIfExists == false) {//checking "false" because if this optional prop may not be given
      const folders = (await this.googleDrive.listFilesInPage(null, getListFilesOpts(this.drive, {
        q: `mimeType = '${GOOGLE_DRIVE_FOLDER_MIME_TYPE}' and name contains '${name}' and trashed=false`.trim(),
      }))).files;
      for (let f of folders) {
        if (f.name == name) {
          folder = f;
          break;
        }
      }
      if (folder) {
        $.export("$summary", "Found existing folder, therefore not creating folder. Returning found folder.");
        const folderDetails = await this.googleDrive.getFile(folder.id);

        return folderDetails;
      }
    }
    const driveId = this.googleDrive.getDriveId(this.drive);
    const resp = await this.googleDrive.createFolder({
      name,
      parentId,
      driveId,
    });
    $.export("$summary", `Successfully created a new folder, "${resp.name}"`);
    return resp;
  },
};

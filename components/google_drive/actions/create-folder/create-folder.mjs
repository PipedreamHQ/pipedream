import googleDrive from "../../google_drive.app.mjs";
import { getListFilesOpts } from "../../utils.mjs";

import { GOOGLE_DRIVE_FOLDER_MIME_TYPE } from "../../constants.mjs";

export default {
  key: "google_drive-create-folder",
  name: "Create Folder",
  description: "Create a new empty folder. [See the docs](https://developers.google.com/drive/api/v3/reference/files/create) for more information",
  version: "0.0.5",
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
        backwards compatability and to be consistent with default Google Drive behavior. 
      `),
      optional: true,
      default: true,
    },
  },
  async run({ $ }) {
    const {
      parentId,
      name,
    } = this;
    
    if(!this.createIfExists){
      const folders = (await this.googleDrive.listFilesInPage(null, getListFilesOpts(this.drive, {
        q: `mimeType = '${GOOGLE_DRIVE_FOLDER_MIME_TYPE}' and name contains '${this.nameSearchTerm}' and trashed=false`.trim()
      }))).files;
      if(folders.length>0){
        $.export("$summary", `Found existing folder, therefore not creating folder. Returning found folder.`);
        return folders[0];
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

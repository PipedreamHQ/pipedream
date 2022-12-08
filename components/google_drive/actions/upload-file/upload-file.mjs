import googleDrive from "../../google_drive.app.mjs";
import path from "path";
import { getFileStream } from "../../utils.mjs";
import { omitEmptyStringValues } from "../../utils.mjs";
import { GOOGLE_DRIVE_UPLOAD_TYPE_MULTIPART } from "../../constants.mjs";

export default {
  key: "google_drive-upload-file",
  name: "Upload File",
  description: "Copy an existing file to Google Drive. [See the docs](https://developers.google.com/drive/api/v3/manage-uploads) for more information",
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
        "The folder you want to upload the file to. If not specified, the file will be placed directly in the drive's top-level folder.",
      optional: true,
    },
    fileUrl: {
      propDefinition: [
        googleDrive,
        "fileUrl",
      ],
    },
    filePath: {
      propDefinition: [
        googleDrive,
        "filePath",
      ],
    },
    name: {
      propDefinition: [
        googleDrive,
        "fileName",
      ],
      description:
        "The name of the new file (e.g. `/myFile.csv`). By default, the name is the same as the source file's.",
    },
    mimeType: {
      propDefinition: [
        googleDrive,
        "mimeType",
      ],
      description:
        "The file's MIME type (e.g., `image/jpeg`). Google Drive will attempt to automatically detect an appropriate value from uploaded content if no value is provided.",
    },
    uploadType: {
      propDefinition: [
        googleDrive,
        "uploadType",
      ],
      default: GOOGLE_DRIVE_UPLOAD_TYPE_MULTIPART,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      parentId,
      fileUrl,
      filePath,
      name,
      mimeType,
    } = this;
    let { uploadType } = this;
    if (!fileUrl && !filePath) {
      throw new Error("One of File URL and File Path is required.");
    }
    const driveId = this.googleDrive.getDriveId(this.drive);
    const file = await getFileStream({
      $,
      fileUrl,
      filePath,
    });
    console.log(`Upload type: ${uploadType}.`);
    const resp = await this.googleDrive.createFile(omitEmptyStringValues({
      file,
      mimeType,
      name: name || path.basename(fileUrl || filePath),
      parentId,
      driveId,
      uploadType,
    }));
    $.export("$summary", `Successfully uploaded a new file, "${resp.name}"`);
    return resp;
  },
};

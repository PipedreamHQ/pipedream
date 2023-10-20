import googleDrive from "../../google_drive.app.mjs";
import path from "path";
import {
  getFileStream,
  omitEmptyStringValues,
} from "../../common/utils.mjs";
import { GOOGLE_DRIVE_UPLOAD_TYPE_MULTIPART } from "../../constants.mjs";

export default {
  key: "google_drive-upload-file",
  name: "Upload File",
  description: "Copy an existing file to Google Drive. [See the docs](https://developers.google.com/drive/api/v3/manage-uploads) for more information",
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
    replaceFile: {
      type: "boolean",
      label: "Replace File",
      description: "Whether should replace file case it exists, default: `false`",
      optional: true,
      default: false,
    },
  },
  methods: {
    async getFileIdForReplace(filename, parentId) {
      if (this.replaceFile) {
        const { files } = await this.googleDrive.listFilesInPage(null, {
          q: `name = '${filename}' and '${parentId || "root"}' in parents and trashed = false`,
          fields: "files/id,files/name,files/parents",
        });
        if (files.length) {
          return files[0].id;
        }
      }
      return null;
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

    const filename = name || path.basename(fileUrl || filePath);
    const fileId = await this.getFileIdForReplace(filename, parentId);

    const file = await getFileStream({
      $,
      fileUrl,
      filePath,
    });
    console.log(`Upload type: ${uploadType}.`);

    let result = null;
    if (fileId) {
      await this.googleDrive.updateFileMedia(fileId, file, omitEmptyStringValues({
        mimeType,
        uploadType,
      }));
      result = await this.googleDrive.updateFile(fileId, omitEmptyStringValues({
        name: filename,
        mimeType,
        uploadType,
      }));
      $.export("$summary", `Successfully updated file, "${result.name}"`);
    } else {
      result = await this.googleDrive.createFile(omitEmptyStringValues({
        file,
        mimeType,
        name: filename,
        parentId,
        driveId,
        uploadType,
      }));
      $.export("$summary", `Successfully uploaded a new file, "${result.name}"`);
    }
    return result;
  },
};

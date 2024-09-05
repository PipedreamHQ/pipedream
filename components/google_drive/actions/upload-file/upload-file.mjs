import googleDrive from "../../google_drive.app.mjs";
import path from "path";
import {
  getFileStream,
  omitEmptyStringValues,
} from "../../common/utils.mjs";
import { GOOGLE_DRIVE_UPLOAD_TYPE_MULTIPART } from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "google_drive-upload-file",
  name: "Upload File",
  description: "Upload a file to Google Drive. [See the documentation](https://developers.google.com/drive/api/v3/manage-uploads) for more information",
  version: "0.1.8",
  type: "action",
  props: {
    googleDrive,
    infoAlert: {
      type: "alert",
      alertType: "info",
      content: "Either `File URL` and `File Path` should be specified.",
    },
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
    fileId: {
      propDefinition: [
        googleDrive,
        "fileId",
      ],
      label: "File to replace",
      description: "Id of the file to replace. Leave it empty to upload a new file.",
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
      throw new ConfigurationError("Either `File URL` and `File Path` should be specified.");
    }
    const driveId = this.googleDrive.getDriveId(this.drive);

    const filename = name || path.basename(fileUrl || filePath);

    const file = await getFileStream({
      $,
      fileUrl,
      filePath: filePath?.startsWith("/tmp/")
        ? filePath
        : `/tmp/${filePath}`,
    });
    console.log(`Upload type: ${uploadType}.`);

    let result = null;
    if (this.fileId) {
      await this.googleDrive.updateFileMedia(this.fileId, file, omitEmptyStringValues({
        mimeType,
        uploadType,
      }));
      result = await this.googleDrive.updateFile(this.fileId, omitEmptyStringValues({
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

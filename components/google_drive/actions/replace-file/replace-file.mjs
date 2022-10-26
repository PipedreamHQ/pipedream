import path from "path";
import googleDrive from "../../google_drive.app.mjs";
import { omitEmptyStringValues } from "../../common/utils.mjs";
import {
  getFileStream,
  streamToBuffer,
  byteToMB,
} from "../../common/utils.mjs";
import {
  GOOGLE_DRIVE_UPLOAD_TYPE_MEDIA,
  GOOGLE_DRIVE_UPLOAD_TYPE_RESUMABLE,
} from "../../common/constants.mjs";

export default {
  key: "google_drive-replace-file",
  name: "Replace File",
  description: "Upload a file that replaces an existing file. [See the docs](https://developers.google.com/drive/api/v3/reference/files/update) for more information",
  version: "0.0.6",
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
    fileId: {
      propDefinition: [
        googleDrive,
        "fileId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      optional: false,
      description: "The file to update",
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
      label: "Name",
      description: "The name of the new file (e.g., `myFile.csv`)",
    },
    mimeType: {
      propDefinition: [
        googleDrive,
        "mimeType",
      ],
      description: "The MIME type of the new file (e.g., `image/jpeg`)",
    },
    uploadType: {
      propDefinition: [
        googleDrive,
        "uploadType",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      fileId,
      fileUrl,
      filePath,
      name,
      mimeType,
    } = this;
    let { uploadType } = this;
    if (!fileUrl && !filePath) {
      throw new Error("One of File URL and File Path is required.");
    }
    const fileStream = await getFileStream({
      $,
      fileUrl,
      filePath,
    });

    if (!uploadType || uploadType === "") {
      try {
        // Its necessary to get the file stream again, after user streamToBuffer function and pass
        // the same object to updateFileMedia function, the function will throw an error about
        // circular json structure.
        // Deep clone is very slow in this case, so its better get the stream again
        const fileBuffer = await streamToBuffer(await getFileStream({
          $,
          fileUrl,
          filePath,
        }));
        const bufferSize = byteToMB(Buffer.byteLength(fileBuffer));
        uploadType = bufferSize > 5
          ? GOOGLE_DRIVE_UPLOAD_TYPE_RESUMABLE
          : undefined;
      } catch (err) {
        console.log(err);
        uploadType = undefined;
      }
    }

    if (uploadType === GOOGLE_DRIVE_UPLOAD_TYPE_MEDIA) {
      uploadType = undefined;
    }
    console.log(`Upload type: ${uploadType}`);
    // Update file media separately from metadata to prevent multipart upload,
    // which `google-apis-nodejs-client` doesn't seem to support for
    // [files.update](https://bit.ly/3lP5sWn)
    await this.googleDrive.updateFileMedia(fileId, fileStream, omitEmptyStringValues({
      mimeType,
      uploadType,
    }));

    const resp = await this.googleDrive.updateFile(fileId, omitEmptyStringValues({
      name: name || path.basename(fileUrl || filePath),
      mimeType,
      uploadType,
    }));
    $.export("$summary", "Successfully replaced the file");
    return resp;
  },
};

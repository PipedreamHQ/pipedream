import path from "path";
import googleDrive from "../../google_drive.app.mjs";
import { omitEmptyStringValues } from "../../utils.mjs";

import { getFileStream } from "../../utils.mjs";

export default {
  key: "google_drive-replace-file",
  name: "Replace File",
  description: "Upload a file that replaces an existing file. [See the docs](https://developers.google.com/drive/api/v3/reference/files/update) for more information",
  version: "0.0.4",
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
  },
  async run({ $ }) {
    const {
      fileId,
      fileUrl,
      filePath,
      name,
      mimeType,
    } = this;
    if (!fileUrl && !filePath) {
      throw new Error("One of File URL and File Path is required.");
    }
    const fileStream = await getFileStream({
      $,
      fileUrl,
      filePath,
    });
    // Update file media separately from metadata to prevent multipart upload,
    // which `google-apis-nodejs-client` doesn't seem to support for
    // [files.update](https://bit.ly/3lP5sWn)
    await this.googleDrive.updateFileMedia(fileId, fileStream, omitEmptyStringValues({
      mimeType,
    }));
    const resp = await this.googleDrive.updateFile(fileId, omitEmptyStringValues({
      name: name || path.basename(fileUrl || filePath),
      mimeType,
    }));
    $.export("$summary", "Successfully replaced the file");
    return resp;
  },
};

import googleDrive from "../../google_drive.app.mjs";
import path from "path";
import { getFileStream } from "../../utils.mjs";

export default {
  key: "google_drive-upload-file",
  name: "Upload File",
  description: "Copy an existing file to Google Drive",
  version: "0.0.1",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description:
        "The drive to use. If not specified, your personal Google Drive will be used. If you are connected with any [Google Shared Drives](https://support.google.com/a/users/answer/9310351), you can select it here.",
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
        "The folder you want to upload the file to. If not specified, the file will be placed directly in the user's My Drive folder.",
      optional: true,
    },
    fileUrl: {
      propDefinition: [
        googleDrive,
        "fileUrl",
      ],
      description:
        "The URL of the file to upload. Must specify either `File URL` or `File Path`.",
    },
    filePath: {
      propDefinition: [
        googleDrive,
        "filePath",
      ],
      description:
        "The path to the file saved to the /tmp (e.g. `/tmp/myFile.csv`). Must specify either `File URL` or `File Path`.",
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
        "The file's MIME type, (e.g., `image/jpeg`). Google Drive will attempt to automatically detect an appropriate value from uploaded content if no value is provided.",
    },
  },
  async run() {
    const {
      parentId,
      fileUrl,
      filePath,
      name,
      mimeType,
    } = this;
    if (!fileUrl && !filePath) {
      throw new Error("One of File URL and File Path is required.");
    }
    const file = await getFileStream({
      fileUrl,
      filePath,
    });
    return await this.googleDrive.createFileFromOpts({
      file,
      mimeType: mimeType || undefined,
      name: name || path.basename(fileUrl || filePath),
      parentId,
    });
  },
};

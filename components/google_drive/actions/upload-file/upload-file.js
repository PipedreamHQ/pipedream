const googleDrive = require("../../google_drive.app");
const path = require("path");
const { getFileStream } = require("../../utils");

module.exports = {
  key: "google_drive-upload-file",
  name: "Upload File",
  description: "Copy an existing file to Google Drive",
  version: "0.0.4",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive you want to upload the file to.",
    },
    parentId: {
      propDefinition: [
        googleDrive,
        "folderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The folder you want to upload the file to.",
      optional: true,
      default: "",
    },
    fileUrl: {
      propDefinition: [
        googleDrive,
        "fileUrl",
      ],
      description:
        "The URL of the file to upload. Must specify either File URL or File Path.",
    },
    filePath: {
      propDefinition: [
        googleDrive,
        "filePath",
      ],
      description:
        "The path to the file saved to the /tmp (e.g. `/tmp/myFile.csv`). Must specify either File URL or File Path.",
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
    return await this.googleDrive.createFile({
      file,
      mimeType: mimeType || undefined,
      name: name || path.basename(fileUrl || filePath),
      parentId,
    });
  },
};

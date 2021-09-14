const path = require("path");
const googleDrive = require("../../google_drive.app");

const { GOOGLE_DRIVE_FOLDER_MIME_TYPE } = require("../../constants");
const { getFileStream } = require("../../utils");

module.exports = {
  key: "google_drive-replace-file",
  name: "Replace File",
  description: "Upload a file that replaces an existing file",
  version: "0.0.62",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive you want to replace a file in.",
      optional: true,
      default: "",
    },
    fileId: {
      propDefinition: [
        googleDrive,
        "fileId",
        (c) => ({
          drive: c.drive,
          baseOpts: {
            q: `mimeType != '${GOOGLE_DRIVE_FOLDER_MIME_TYPE}' and 'me' in writers`,
          },
        }),
      ],
      optional: false,
      description: "The file to update.",
    },
    fileUrl: {
      propDefinition: [
        googleDrive,
        "fileUrl",
      ],
      description:
        "The URL of the file to attach. Must specify either File URL or File Path.",
    },
    filePath: {
      propDefinition: [
        googleDrive,
        "filePath",
      ],
      description:
        "The path to the file saved to the /tmp (e.g., `/tmp/myFile.csv`). Must specify either File URL or File Path.",
    },
    name: {
      propDefinition: [
        googleDrive,
        "fileName",
      ],
      label: "Name",
      description: "The new name of the file (e.g., `myFile.csv`).",
    },
    mimeType: {
      propDefinition: [
        googleDrive,
        "mimeType",
      ],
      description: "The new file's MIME type, (e.g., `image/jpeg`).",
    },
  },
  async run() {
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
      fileUrl,
      filePath,
    });
    // Update file media separately from metadata to prevent multipart upload,
    // which the Google API client doesn't seem to support for files.update.
    await this.googleDrive.updateFileMedia(fileId, fileStream, {
      mimeType: mimeType || undefined,
    });
    return await this.googleDrive.updateFile(fileId, {
      name: name || path.basename(fileUrl || filePath),
      mimeType,
    });
  },
};

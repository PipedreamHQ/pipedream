import googleDrive from "../../google_drive.app.mjs";
import path from "path";
import { getFileStream } from "../../utils.mjs";
import { omitEmptyStringValues } from "../../utils.mjs";

export default {
  key: "google_drive-upload-file",
  name: "Upload File",
  description: "Copy an existing file to Google Drive. [See the docs](https://developers.google.com/drive/api/v3/manage-uploads) for more information",
  version: "0.0.2",
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
        "The folder you want to upload the file to. If not specified, the file will be placed directly in the user's My Drive folder.",
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
  },
  async run({ $ }) {
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
      $,
      fileUrl,
      filePath,
    });
    const resp = await this.googleDrive.createFileFromOpts(omitEmptyStringValues({
      file,
      mimeType,
      name: name || path.basename(fileUrl || filePath),
      parentId,
    }));
    $.export("$summary", `Successfully uploaded a new file, "${resp.name}"`);
    return resp;
  },
};

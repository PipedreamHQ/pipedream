import {
  ConfigurationError,
  getFileStreamAndMetadata,
} from "@pipedream/platform";
import { GOOGLE_DRIVE_UPLOAD_TYPE_MULTIPART } from "../../common/constants.mjs";
import {
  omitEmptyStringValues,
  parseObjectEntries,
} from "../../common/utils.mjs";
import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-upload-file",
  name: "Upload File",
  description: "Upload a file to Google Drive. [See the documentation](https://developers.google.com/drive/api/v3/manage-uploads) for more information",
  version: "2.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf).",
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
      description: "ID of the file to replace. Leave it empty to upload a new file.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Additional metadata to supply in the upload. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/files) for information on available fields. Values will be parsed as JSON where applicable. Example: `{ \"description\": \"my file description\" }`",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      parentId,
      filePath,
      name,
      mimeType,
    } = this;
    let { uploadType } = this;
    const driveId = this.googleDrive.getDriveId(this.drive);

    const {
      stream: file, metadata: fileMetadata,
    } = await getFileStreamAndMetadata(filePath);

    const filename = name || fileMetadata.name;

    const metadata = this.metadata
      ? parseObjectEntries(this.metadata)
      : undefined;

    if (metadata?.mimeType && !mimeType) {
      throw new ConfigurationError(`Please include the file's original MIME type in the \`Mime Type\` prop. File will be converted to \`${metadata.mimeType}\`.`);
    }

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
        requestBody: metadata,
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
        requestBody: metadata,
      }));
      $.export("$summary", `Successfully uploaded a new file, "${result.name}"`);
    }
    return result;
  },
};

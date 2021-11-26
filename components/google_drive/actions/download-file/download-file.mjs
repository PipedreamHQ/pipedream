import googleDrive from "../../google_drive.app.mjs";
import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import { GOOGLE_DRIVE_MIME_TYPE_PREFIX } from "../../constants.mjs";
import googleWorkspaceExportFormats from "../google-workspace-export-formats.mjs";
import { toSingleLineString } from "../../utils.mjs";

/**
 * Uses Google Drive API to download files to a `filePath` in the /tmp
 * directory.
 *
 * Use `files.export` for Google Workspace files types (e.g.,
 * `application/vnd.google-apps.document`) and `files.get` for other file types,
 * as per the [Download files API guide](https://bit.ly/2ZbJvcn).
 */
export default {
  key: "google_drive-download-file",
  name: "Download File",
  description: "Download a file. [See the docs](https://developers.google.com/drive/api/v3/manage-downloads) for more information",
  version: "0.0.1",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: toSingleLineString(`
        The drive to use. If not specified, your personal Google Drive will be used. If you are
        connected with any [Google Shared
        Drives](https://support.google.com/a/users/answer/9310351), you can select it here.
      `),
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
      description: "The file to download",
    },
    filePath: {
      type: "string",
      label: "Destination File Path",
      description: toSingleLineString(`
        The destination path for the file in the [\`/tmp\`
        directory](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory)
        (e.g., \`/tmp/myFile.csv\`)
      `),
    },
    mimeType: {
      propDefinition: [
        googleDrive,
        "mimeType",
      ],
      label: "Conversion Format",
      description: toSingleLineString(`
        The format to which to convert the downloaded file if it is a [Google Workspace
        document](https://developers.google.com/drive/api/v3/ref-export-formats)
      `),
      options: googleWorkspaceExportFormats,
      optional: false,
      default: "application/pdf",
    },
  },
  async run({ $ }) {
    // Get file metadata to get file's MIME type
    const fileMetadata = await this.googleDrive.getFile(this.fileId, {
      fields: "name,mimeType",
    });
    const mimeType = fileMetadata.mimeType;

    // Download file
    // If `mimeType` is a Google MIME type, use `downloadWorkspaceFile`.
    // Otherwise, use `getFile`. See
    // https://developers.google.com/drive/api/v3/mime-types for a list of
    // Google MIME types. Converting Google Workspace formats to
    // `application/pdf` by default because it is supported for all Google
    // Workspace formats other than Apps Scripts. Google Workspace format to
    // MIME type map:
    // https://developers.google.com/drive/api/v3/ref-export-formats
    const file = mimeType.includes(GOOGLE_DRIVE_MIME_TYPE_PREFIX)
      ? await this.googleDrive.downloadWorkspaceFile(this.fileId, {
        mimeType: this.mimeType,
      })
      : await this.googleDrive.getFile(this.fileId, {
        alt: "media",
      });

    // Stream file to `filePath`
    const pipeline = promisify(stream.pipeline);
    await pipeline(file, fs.createWriteStream(this.filePath));
    $.export("$summary", `Successfully downloaded the file, "${file.name}"`);
    return fileMetadata;
  },
};

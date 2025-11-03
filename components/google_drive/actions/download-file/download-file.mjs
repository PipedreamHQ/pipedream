import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import { GOOGLE_DRIVE_MIME_TYPE_PREFIX } from "../../common/constants.mjs";
import { toSingleLineString } from "../../common/utils.mjs";
import googleDrive from "../../google_drive.app.mjs";
import googleWorkspaceExportFormats from "../common/google-workspace-export-formats.mjs";

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
  description: "Download a file. [See the documentation](https://developers.google.com/drive/api/v3/manage-downloads) for more information",
  version: "0.1.17",
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
        The destination file name or path [in the \`/tmp\`
        directory](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory)
        (e.g., \`/tmp/myFile.csv\`)
      `),
      optional: true,
    },
    mimeType: {
      type: "string",
      label: "Conversion Format",
      description: toSingleLineString(`
        The format to which to convert the downloaded file if it is a [Google Workspace
        document](https://developers.google.com/drive/api/v3/ref-export-formats)
      `),
      optional: true,
      async options() {
        const fileId = this.fileId;
        if (!fileId) {
          return googleWorkspaceExportFormats;
        }
        let file, exportFormats;
        try {
          ([
            file,
            exportFormats,
          ] = await Promise.all([
            this.googleDrive.getFile(fileId, {
              fields: "mimeType",
            }),
            this.googleDrive.getExportFormats(),
          ]));
        } catch (err) {
          return googleWorkspaceExportFormats;
        }
        const mimeTypes = exportFormats[file.mimeType];
        if (!mimeTypes) {
          return [];
        }
        return exportFormats[file.mimeType].map((f) =>
          googleWorkspaceExportFormats.find(
            (format) => format.value === f,
          ) ?? {
            value: f,
            label: f,
          });
      },
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
    getBufferResponse: {
      type: "boolean",
      label: "Get Buffer Response",
      description: "Whether to return the file content as a buffer instead of writing to a file path",
      optional: true,
    },
  },
  async run({ $ }) {
    // Validate that filePath is provided when not getting raw response
    if (!this.getBufferResponse && !this.filePath) {
      throw new Error("File Path is required when not using Get Buffer Response");
    }

    // Get file metadata to get file's MIME type
    const fileMetadata = await this.googleDrive.getFile(this.fileId, {
      fields: "name,mimeType",
    });
    const mimeType = fileMetadata.mimeType;

    const isWorkspaceDocument = mimeType.includes(GOOGLE_DRIVE_MIME_TYPE_PREFIX);
    if (isWorkspaceDocument && !this.mimeType) {
      throw new Error("Conversion Format is required when File is a Google Workspace Document");
    }
    // Download file
    // If `mimeType` is a Google MIME type, use `downloadWorkspaceFile`. Otherwise, use `getFile`.
    // See https://developers.google.com/drive/api/v3/mime-types for a list of Google MIME types.
    // Google Workspace format to MIME type map:
    // https://developers.google.com/drive/api/v3/ref-export-formats
    const file = isWorkspaceDocument
      ? await this.googleDrive.downloadWorkspaceFile(this.fileId, {
        mimeType: this.mimeType,
      })
      : await this.googleDrive.getFile(this.fileId, {
        alt: "media",
      });

    if (this.getBufferResponse) {
      $.export("$summary", `Successfully retrieved raw content for file "${fileMetadata.name}"`);

      // Convert stream to buffer
      const chunks = [];
      for await (const chunk of file) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      return {
        fileMetadata,
        content: buffer,
      };
    }

    // Stream file to `filePath`
    const pipeline = promisify(stream.pipeline);
    const filePath = this.filePath.includes("tmp/")
      ? this.filePath
      : `/tmp/${this.filePath}`;
    await pipeline(file, fs.createWriteStream(filePath));
    $.export("$summary", `Successfully downloaded the file, "${fileMetadata.name}"`);
    return {
      fileMetadata,
      filePath,
    };
  },
};

import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import { GOOGLE_DRIVE_MIME_TYPE_PREFIX } from "../../common/constants.mjs";
import { toSingleLineString } from "../../common/utils.mjs";
import googleDrive from "../../google_drive.app.mjs";
import googleWorkspaceExportFormats from "../common/google-workspace-export-formats.mjs";
import {
  defaultExportMimeBySource,
  extensionByMime,
  unsupportedWorkspaceMimes,
} from "../common/google-workspace-default-export-formats.mjs";

const SHORTCUT_MIME_TYPE = "application/vnd.google-apps.shortcut";

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
  description: "Download a file from Google Drive to the `/tmp` directory or return its contents as a buffer."
    + " Use to fetch a file's contents for processing in downstream steps — e.g., parsing a CSV, extracting text from a PDF, or re-uploading to another service."
    + " For Google Workspace files (Docs, Sheets, Slides, Drawings, Apps Script), exports to an Office-compatible format by default:"
    + " Docs → `.docx`, Sheets → `.xlsx`, Slides → `.pptx`, Drawings → PNG, Apps Script → JSON."
    + " Pass `mimeType` to force a specific format. Shortcuts are resolved to their target automatically."
    + " Folders, Forms, and My Maps cannot be downloaded via this action."
    + " [See the documentation](https://developers.google.com/drive/api/v3/manage-downloads)",
  version: "0.1.24",
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
      description: "The shared drive the file is in, if any. Leave empty for files in My Drive.",
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
      description: "The Google Drive file to download. Accepts a file ID (opaque Drive identifier). If a shortcut is passed, the target file is resolved and downloaded automatically.",
    },
    filePath: {
      type: "string",
      label: "Destination File Path",
      description: toSingleLineString(`
        The destination file name or path [in the \`/tmp\`
        directory](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory)
        (e.g., \`/tmp/myFile.csv\`). Defaults to \`/tmp/<file name>\` if omitted.
        **Note:** if you set this for a Google Workspace file, the extension you
        choose should match the Conversion Format; otherwise the file contents
        may not match the extension.
      `),
      optional: true,
    },
    mimeType: {
      type: "string",
      label: "Conversion Format",
      description: toSingleLineString(`
        The format to which to convert the downloaded file if it is a [Google Workspace
        document](https://developers.google.com/drive/api/v3/ref-export-formats).
        If omitted, defaults per source type: Docs → \`.docx\`, Sheets → \`.xlsx\`,
        Slides → \`.pptx\`, Drawings → PNG, Apps Script → JSON.
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
      optional: true,
    },
    getBufferResponse: {
      type: "boolean",
      label: "Get Buffer Response",
      description: "If true, returns the file content as a buffer in the output (useful for passing directly to another step) instead of writing it to `/tmp`. Defaults to false.",
      optional: true,
    },
  },
  async run({ $ }) {
    let fileMetadata = await this.googleDrive.getFile(this.fileId, {
      fields: "name,mimeType,shortcutDetails,webViewLink",
    });

    // Shortcuts point at a target file; resolve and download the target instead.
    let downloadFileId = this.fileId;
    let resolvedFromShortcut = false;
    if (fileMetadata.mimeType === SHORTCUT_MIME_TYPE) {
      const targetId = fileMetadata.shortcutDetails?.targetId;
      if (!targetId) {
        throw new Error(`Shortcut "${fileMetadata.name}" has no target file and cannot be downloaded.`);
      }
      downloadFileId = targetId;
      resolvedFromShortcut = true;
      fileMetadata = await this.googleDrive.getFile(targetId, {
        fields: "name,mimeType,webViewLink",
      });
    }

    const sourceMimeType = fileMetadata.mimeType;

    if (unsupportedWorkspaceMimes[sourceMimeType]) {
      throw new Error(
        `Cannot download file of type "${sourceMimeType}": ${unsupportedWorkspaceMimes[sourceMimeType]}`,
      );
    }

    const isWorkspaceDocument = sourceMimeType.includes(GOOGLE_DRIVE_MIME_TYPE_PREFIX);

    // Fallback: user value -> static default -> runtime getExportFormats().
    let effectiveMimeType = this.mimeType;
    if (isWorkspaceDocument && !effectiveMimeType) {
      effectiveMimeType = defaultExportMimeBySource[sourceMimeType];
      if (!effectiveMimeType) {
        const exportFormats = await this.googleDrive.getExportFormats();
        effectiveMimeType = exportFormats[sourceMimeType]?.[0];
      }
      if (!effectiveMimeType) {
        throw new Error(
          `No export format available for "${sourceMimeType}". Set Conversion Format explicitly.`,
        );
      }
    }

    // See https://developers.google.com/drive/api/v3/mime-types for Google MIME types.
    const file = isWorkspaceDocument
      ? await this.googleDrive.downloadWorkspaceFile(downloadFileId, {
        mimeType: effectiveMimeType,
      })
      : await this.googleDrive.getFile(downloadFileId, {
        alt: "media",
      });

    const summaryPrefix = resolvedFromShortcut
      ? "Resolved shortcut and downloaded"
      : "Successfully downloaded";

    if (this.getBufferResponse) {
      $.export("$summary", `${summaryPrefix} raw content for file "${fileMetadata.name}"`);

      const chunks = [];
      for await (const chunk of file) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      return {
        fileId: this.fileId,
        fileMetadata,
        webViewLink: fileMetadata.webViewLink,
        content: buffer,
      };
    }

    let filePath;
    if (this.filePath) {
      filePath = this.filePath.includes("tmp/")
        ? this.filePath
        : `/tmp/${this.filePath}`;
    } else {
      let defaultName = fileMetadata.name;
      if (isWorkspaceDocument) {
        const ext = extensionByMime[effectiveMimeType];
        if (ext && !defaultName.toLowerCase().endsWith(`.${ext.toLowerCase()}`)) {
          defaultName = `${defaultName}.${ext}`;
        }
      }
      filePath = `/tmp/${defaultName}`;
    }

    const pipeline = promisify(stream.pipeline);
    await pipeline(file, fs.createWriteStream(filePath));
    $.export("$summary", `${summaryPrefix} the file, "${fileMetadata.name}"`);
    return {
      fileId: this.fileId,
      fileMetadata,
      webViewLink: fileMetadata.webViewLink,
      filePath,
    };
  },
};

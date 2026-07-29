import { ConfigurationError } from "@pipedream/platform";
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
  description: "Download one or more files from Google Drive to the `/tmp` directory or return their contents as buffers."
    + " Select multiple files to download a batch in a single run."
    + " Use to fetch a file's contents for processing in downstream steps — e.g., parsing a CSV, extracting text from a PDF, or re-uploading to another service."
    + " For Google Workspace files (Docs, Sheets, Slides, Drawings, Apps Script), exports to an Office-compatible format by default:"
    + " Docs → `.docx`, Sheets → `.xlsx`, Slides → `.pptx`, Drawings → PNG, Apps Script → JSON."
    + " Pass `mimeType` to force a specific format. Shortcuts are resolved to their target automatically."
    + " Folders, Forms, and My Maps cannot be downloaded via this action."
    + " [See the documentation](https://developers.google.com/drive/api/v3/manage-downloads)",
  version: "0.2.0",
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
    fileIds: {
      propDefinition: [
        googleDrive,
        "fileId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      type: "string[]",
      label: "Files",
      description: "The Google Drive file(s) to download. Select one or more files to download a batch in a single run. Accepts file IDs (opaque Drive identifiers). Shortcuts are resolved to their target automatically.",
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
      description: "A single Google Drive file to download. Kept for backwards compatibility — prefer `Files` for new configurations. If both are set, this file is included alongside the ones in `Files`.",
      optional: true,
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
        const fileId = this.fileId ?? this.fileIds?.[0];
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
    // Combine the batch input (`fileIds`) with the legacy single `fileId`, keeping
    // order and dropping duplicates so the same file isn't downloaded twice.
    const requestedIds = [
      ...(this.fileIds ?? []),
      ...(this.fileId
        ? [
          this.fileId,
        ]
        : []),
    ];
    const fileIds = [
      ...new Set(requestedIds),
    ];

    if (fileIds.length === 0) {
      throw new ConfigurationError("Select at least one file to download (`Files` or `File`).");
    }
    if (fileIds.length > 1 && this.filePath) {
      throw new ConfigurationError("`Destination File Path` can only be used when downloading a single file. Remove it to download multiple files (each saves to `/tmp/<file name>`).");
    }

    const pipeline = promisify(stream.pipeline);

    // Downloads a single file (resolving shortcuts + Workspace export formats),
    // either writing it to /tmp or returning its contents as a buffer.
    const downloadOne = async (requestedFileId) => {
      let fileMetadata = await this.googleDrive.getFile(requestedFileId, {
        fields: "name,mimeType,shortcutDetails,webViewLink",
      });

      // Shortcuts point at a target file; resolve and download the target instead.
      let downloadFileId = requestedFileId;
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

      if (this.getBufferResponse) {
        const chunks = [];
        for await (const chunk of file) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        return {
          fileId: requestedFileId,
          fileMetadata,
          webViewLink: fileMetadata.webViewLink,
          content: buffer,
          resolvedFromShortcut,
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

      await pipeline(file, fs.createWriteStream(filePath));

      return {
        fileId: requestedFileId,
        fileMetadata,
        webViewLink: fileMetadata.webViewLink,
        filePath,
        resolvedFromShortcut,
      };
    };

    // Single-file downloads keep the original (non-array) return shape for
    // backwards compatibility; batches return an array of per-file results.
    if (fileIds.length === 1) {
      const result = await downloadOne(fileIds[0]);
      const verb = result.resolvedFromShortcut
        ? "Resolved shortcut and downloaded"
        : "Successfully downloaded";
      const what = this.getBufferResponse
        ? `raw content for file "${result.fileMetadata.name}"`
        : `the file, "${result.fileMetadata.name}"`;
      $.export("$summary", `${verb} ${what}`);
      return result;
    }

    const files = [];
    for (const id of fileIds) {
      files.push(await downloadOne(id));
    }
    $.export("$summary", `Successfully downloaded ${files.length} file(s).`);
    return {
      files,
      count: files.length,
    };
  },
};

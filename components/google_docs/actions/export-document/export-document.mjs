import googleDocs from "../../google_docs.app.mjs";
import fs from "fs";
import stream from "stream";
import { promisify } from "util";

const pipeline = promisify(stream.pipeline);

const FORMATS = {
  pdf: {
    mimeType: "application/pdf",
    ext: "pdf",
  },
  docx: {
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ext: "docx",
  },
  txt: {
    mimeType: "text/plain",
    ext: "txt",
  },
  html: {
    mimeType: "text/html",
    ext: "html",
  },
  odt: {
    mimeType: "application/vnd.oasis.opendocument.text",
    ext: "odt",
  },
};

export default {
  key: "google_docs-export-document",
  name: "Export Document",
  description: "Export a Google Doc to a file in PDF, DOCX, TXT, HTML, or ODT format. Use when asked to export, download, convert, or \"save as\" a doc in one of those formats. Use **Find Document** to resolve a document's name to its ID. Returns `{filePath, filename, mimeType}`, where `filePath` is the exported file in the workflow's temporary storage - it is a local path, not a shareable download link. [See the documentation](https://developers.google.com/drive/api/v3/reference/files/export)",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    googleDocs,
    documentId: {
      propDefinition: [
        googleDocs,
        "documentId",
      ],
    },
    format: {
      type: "string",
      label: "Format",
      description: "The format to export the document as.",
      options: Object.keys(FORMATS),
      default: "pdf",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const format = FORMATS[this.format];
    if (!format) {
      throw new Error(`Unsupported format "${this.format}". Use one of: ${Object.keys(FORMATS).join(", ")}.`);
    }

    const file = await this.googleDocs.getFile(this.documentId, {
      fields: "name",
    });
    const safeName = (file?.name || this.documentId).replace(/[/\\]/g, "_");
    const filename = `${safeName}.${format.ext}`;
    const filePath = `${process.env.STASH_DIR || "/tmp"}/${filename}`;

    const downloadStream = await this.googleDocs.downloadWorkspaceFile(this.documentId, {
      mimeType: format.mimeType,
    });
    await pipeline(downloadStream, fs.createWriteStream(filePath));

    $.export("$summary", `Exported document ${this.documentId} as ${filename}`);
    return {
      filePath,
      filename,
      mimeType: format.mimeType,
    };
  },
};

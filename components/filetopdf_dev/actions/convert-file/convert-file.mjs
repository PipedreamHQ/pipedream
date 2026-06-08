import FormData from "form-data";
import { ConfigurationError, getFileStreamAndMetadata } from "@pipedream/platform";
import app from "../../filetopdf_dev.app.mjs";

export default {
  key: "filetopdf_dev-convert-file",
  name: "Convert a File to PDF",
  description: "Convert Word, Excel, PowerPoint, images and 130+ formats into PDF — from a file or a public URL. The converter is chosen automatically from the file extension. [See the documentation](https://filetopdf.dev/file).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    file: {
      type: "string",
      label: "File",
      description: "The file to convert — a path to a file in `/tmp` (map it from a previous step, e.g. Google Drive, Dropbox, an HTTP download, an email attachment) **or** a downloadable URL. We read it and upload it. Leave blank if you're using a File URL instead.",
      format: "file-ref",
      optional: true,
    },
    url: {
      type: "string",
      label: "File URL",
      description: "Or a public http(s) link to your file — FileToPDF downloads it server-side and converts by its extension. (Private/internal addresses aren't allowed.) Used only when no **File** is provided.",
      optional: true,
    },
    filename: {
      type: "string",
      label: "File Name",
      description: "Your file's name, including its extension — e.g. `report.docx`. We use the extension to pick the converter and to name your PDF. Usually detected automatically; set it here if your file has no extension or the wrong one.",
      optional: true,
    },
    // LibreOffice/passthrough options (advanced). No paper size/margins/scale —
    // those are Chromium-only and ignored by the document/image converters.
    landscape: { propDefinition: [app, "landscape"] },
    nativePageRanges: { propDefinition: [app, "nativePageRanges"] },
    pdfa: { propDefinition: [app, "pdfa"] },
    pdfua: { propDefinition: [app, "pdfua"] },
    sourcePassword: { propDefinition: [app, "sourcePassword"] },
    userPassword: { propDefinition: [app, "userPassword"] },
    ownerPassword: { propDefinition: [app, "ownerPassword"] },
    syncDir: {
      type: "dir",
      accessMode: "read-write",
      sync: true,
    },
  },
  async run({ $ }) {
    const options = this.app.stringifyOptions({
      landscape: this.landscape,
      nativePageRanges: this.nativePageRanges,
      pdfa: this.pdfa,
      pdfua: this.pdfua,
      sourcePassword: this.sourcePassword,
      userPassword: this.userPassword,
      ownerPassword: this.ownerPassword,
    });

    let envelope;
    if (this.file) {
      // Upload mode. getFileStreamAndMetadata accepts a /tmp path or a URL and
      // returns a readable stream + metadata (name, contentType, size).
      const { stream, metadata } = await getFileStreamAndMetadata(this.file);
      const form = new FormData();
      const name = this.filename || metadata.name || "upload";
      form.append("files", stream, {
        filename: name,
        contentType: metadata.contentType || "application/octet-stream",
        knownLength: metadata.size,
      });
      for (const [key, value] of Object.entries(options)) {
        form.append(key, value);
      }
      envelope = await this.app.convertMultipart($, "/file", form);
    } else if (this.url) {
      // URL mode — the API downloads and converts the file itself.
      envelope = await this.app.convertJson($, "/file", {
        url: this.url,
        ...options,
      });
    } else {
      throw new ConfigurationError("Provide a File (a /tmp path or URL to upload), or a public File URL for FileToPDF to download.");
    }

    const out = await this.app.writePdfToTmp(envelope);
    $.export("$summary", `Converted ${out.filename} — ${out.pages} page(s), ${out.creditsRemaining} credits left`);
    return out;
  },
};

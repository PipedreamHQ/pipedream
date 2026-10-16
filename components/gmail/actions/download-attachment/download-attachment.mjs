import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { PassThrough } from "stream";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import mammoth from "mammoth";
import mime from "mime";
import gmail from "../../gmail.app.mjs";
import { sniffMimeType } from "../../common/mime.mjs";

export default {
  key: "gmail-download-attachment",
  name: "Download Attachment",
  description:
    "Download a Gmail message attachment to `/tmp` and return its path + metadata. File Stash syncs the file and exposes a presigned download URL so the caller can retrieve it."
    + " Call **Find Emails** (with `format: \"full\"`) or **Get Thread** first — attachment IDs only appear in full-format message reads; each returned message's `payload.parts[]` enumerates attachments as `{ body.attachmentId, filename, mimeType }`. Pass the enclosing message's `id` as `messageId` and the part's `body.attachmentId` as `attachmentId`."
    + " Gmail issues a new `attachmentId` for the same part on every read, so the download always uses the `attachmentId` you pass, and the filename and MIME type are resolved separately: by `partId` (stable across reads; recommended), then by a unique filename-and-size match, then by a unique size match. If none resolve, the file is saved as `attachment-<id>` with an extension detected from its contents."
    + " Set `convertToPdf: true` to convert image / HTML / plain-text / DOCX attachments to PDF during download; other MIME types are rejected."
    + " [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.messages.attachments/get).",
  version: "0.2.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    gmail,
    messageId: {
      type: "string",
      label: "Message ID",
      description: "The `id` of the message containing the attachment. Obtain this from **Find Emails** or **Get Thread**.",
    },
    attachmentId: {
      type: "string",
      label: "Attachment ID",
      description: "The attachment's ID. Find this on a message's `payload.parts[].body.attachmentId` — attachment IDs only appear when **Find Emails** is called with `format: \"full\"`, or when using **Get Thread** (which always returns full payloads).",
    },
    partId: {
      type: "string",
      label: "Part ID",
      description: "The attachment part's `payload.parts[].partId` (e.g. `1` or `0.2`) from the same **Find Emails** / **Get Thread** read. Unlike `attachmentId`, `partId` is stable across reads, so passing it lets the action reliably resolve the attachment's filename and MIME type (needed for `convertToPdf`).",
      optional: true,
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "Filename to save in `/tmp` (include the extension, e.g. `report.pdf`). Pass the part's `filename` when you have it. If omitted, the action resolves it from the message payload (see `partId`).",
      optional: true,
    },
    convertToPdf: {
      type: "boolean",
      label: "Convert to PDF",
      description: "When true, convert the attachment to a PDF. Supported source MIME types: image/*, text/html, text/plain, and DOCX (`application/vnd.openxmlformats-officedocument.wordprocessingml.document`). Other types throw.",
      optional: true,
      default: false,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  methods: {
    escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    },
    async imageToPdf(imageBuffer) {
      return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
          autoFirstPage: false,
        });
        const stream = new PassThrough();
        const chunks = [];

        stream.on("data", (c) => chunks.push(c));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
        doc.on("error", reject);

        doc.pipe(stream);
        doc.addPage();
        doc.image(imageBuffer, {
          fit: [
            500,
            700,
          ],
          align: "center",
        });
        doc.end();
      });
    },
    listAttachmentParts(part, acc = []) {
      if (!part) return acc;
      if (part.body?.attachmentId) {
        acc.push(part);
      }
      for (const child of part.parts ?? []) {
        this.listAttachmentParts(child, acc);
      }
      return acc;
    },
    // Gmail returns a fresh attachmentId on every message read, so the caller's id
    // can't be compared against a new read. Resolve the part by stable properties instead.
    resolvePart(parts, size) {
      const byAttachmentId = parts.find((p) => p.body.attachmentId === this.attachmentId);
      if (byAttachmentId) return byAttachmentId;
      if (this.partId) {
        const byPartId = parts.find((p) => p.partId === this.partId);
        if (byPartId) return byPartId;
      }
      if (this.filename) {
        const byName = parts.filter((p) => p.filename === this.filename);
        const bySize = byName.filter((p) => p.body.size === size);
        if (bySize.length === 1) return bySize[0];
        // Parts matching both name and size can still tell us a shared MIME type.
        const mimeTypes = new Set(bySize.map((p) => p.mimeType));
        if (bySize.length > 1 && mimeTypes.size === 1) {
          return {
            filename: this.filename,
            mimeType: bySize[0].mimeType,
          };
        }
      }
      const bySize = parts.filter((p) => p.body.size === size);
      if (bySize.length === 1) return bySize[0];
      return undefined;
    },
    async htmlToPdf(htmlBuffer) {
      const browser = await puppeteer.launch({
        executablePath: await chromium.executablePath(),
        args: chromium.args,
        headless: chromium.headless,
      });
      try {
        const page = await browser.newPage();
        await page.setContent(htmlBuffer.toString("utf8"), {
          waitUntil: "domcontentloaded",
        });
        return await page.pdf({
          format: "A4",
        });
      } finally {
        await browser.close();
      }
    },
  },
  async run({ $ }) {
    // Always download with the caller's attachmentId: it is valid even though a
    // fresh message read would report a different id for the same part.
    const attachment = await this.gmail.getAttachment({
      messageId: this.messageId,
      attachmentId: this.attachmentId,
    });
    let buffer = Buffer.from(attachment.data, "base64");

    let filename = this.filename;
    let sourceMimeType;
    if (!filename || this.convertToPdf) {
      const message = await this.gmail.getMessage({
        id: this.messageId,
      });
      const parts = this.listAttachmentParts(message.payload);
      const part = this.resolvePart(parts, attachment.size ?? buffer.length);
      filename = filename || part?.filename;
      sourceMimeType = part?.mimeType;
    }
    if (!sourceMimeType || sourceMimeType === "application/octet-stream") {
      sourceMimeType = sniffMimeType(buffer) ?? sourceMimeType;
    }
    if (!filename) {
      const extension = sourceMimeType && sourceMimeType !== "application/zip"
        ? mime.getExtension(sourceMimeType)
        : undefined;
      filename = `attachment-${this.attachmentId.slice(0, 8)}${extension
        ? `.${extension}`
        : ""}`;
    }
    const safeFilename = path.basename(filename);
    if (safeFilename !== filename || safeFilename === "" || safeFilename === "." || safeFilename === "..") {
      throw new ConfigurationError(`Invalid filename "${filename}" — must not contain path separators or traversal segments.`);
    }
    filename = safeFilename;

    if (this.convertToPdf && sourceMimeType !== "application/pdf") {
      if (sourceMimeType?.startsWith("image/")) {
        buffer = await this.imageToPdf(buffer);
      } else if (sourceMimeType === "text/html") {
        buffer = await this.htmlToPdf(buffer);
      } else if (sourceMimeType === "text/plain") {
        const textBuffer = Buffer.from(`<pre>${this.escapeHtml(buffer.toString("utf8"))}</pre>`, "utf8");
        buffer = await this.htmlToPdf(textBuffer);
      } else if (sourceMimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const { value: html } = await mammoth.convertToHtml({
          buffer,
        });
        buffer = await this.htmlToPdf(html);
      } else if (!sourceMimeType || sourceMimeType === "application/zip") {
        throw new ConfigurationError(`Could not determine the MIME type of attachment ${this.attachmentId} in message ${this.messageId}. Pass \`partId\` (from \`payload.parts[].partId\`) or \`filename\` so the attachment part can be identified.`);
      } else {
        throw new ConfigurationError(`Cannot convert file type: ${sourceMimeType} to PDF`);
      }
      filename = `${path.parse(filename).name}.pdf`;
    }

    const stashDir = process.env.STASH_DIR || "/tmp";
    const filePath = path.join(stashDir, filename);
    fs.writeFileSync(filePath, buffer);

    $.export("$summary", `Downloaded ${filename} (${buffer.length} bytes)`);

    return {
      filename,
      filePath,
      size: buffer.length,
    };
  },
};

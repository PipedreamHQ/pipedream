import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { PassThrough } from "stream";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import mammoth from "mammoth";
import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-download-attachment",
  name: "Download Attachment",
  description:
    "Download a Gmail message attachment to `/tmp` and return its path + metadata. File Stash syncs the file and exposes a presigned download URL so the caller can retrieve it."
    + " Call **Find Emails** (with `format: \"full\"`) or **Get Thread** first — attachment IDs only appear in full-format message reads; each returned message's `payload.parts[]` enumerates attachments as `{ body.attachmentId, filename, mimeType }`. Pass the enclosing message's `id` as `messageId` and the part's `body.attachmentId` as `attachmentId`."
    + " Gmail issues a new `attachmentId` for the same attachment on every message read; an id from any recent read still downloads."
    + " Pass `filename` or `partId` from the same read for a correct name; otherwise, a unique size match supplies the name, or the action uses a generic name."
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
      description: "The attachment's ID. Find this on a message's `payload.parts[].body.attachmentId` — attachment IDs only appear when **Find Emails** is called with `format: \"full\"`, or when using **Get Thread** (which always returns full payloads). The value differs on every read of the message; any value from a recent read is valid.",
    },
    partId: {
      type: "string",
      label: "Part ID",
      description: "Optional. The attachment part's `payload.parts[].partId` (for example `1` or `0.2`). Use **Find Emails** with `format: \"full\"` or **Get Thread** to find it, in the same read that returned `attachmentId`. Unlike `attachmentId`, it is stable across reads, so it reliably identifies the attachment's filename and MIME type.",
      optional: true,
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "Filename to save in `/tmp` (include the extension, e.g. `report.pdf`). If omitted, the action looks up the filename from the message payload.",
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
    collectParts(part, out = []) {
      if (!part) return out;
      out.push(part);
      for (const child of part.parts ?? []) {
        this.collectParts(child, out);
      }
      return out;
    },
    // Selectors only name the file and give its MIME type; the bytes always come from the caller's attachmentId.
    resolvePart(parts) {
      const byPartId = this.partId != null
        && parts.find((p) => String(p.partId) === String(this.partId));
      if (byPartId) return byPartId;
      // Filenames are not unique (e.g. two inline "image001.png"), so only a unique match counts.
      const byName = this.filename
        ? parts.filter((p) => p.filename === this.filename)
        : [];
      return byName.length === 1
        ? byName[0]
        : undefined;
    },
    sniffMimeType(buffer) {
      const head = buffer.subarray(0, 8);
      if (head.subarray(0, 5).toString("latin1") === "%PDF-") return "application/pdf";
      if (head[0] === 0x89 && head.subarray(1, 4).toString("latin1") === "PNG") return "image/png";
      if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return "image/jpeg";
      if (head.subarray(0, 4).toString("latin1") === "GIF8") return "image/gif";
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
    let filename = this.filename;
    let parts = [];
    let part;
    if (!filename || this.convertToPdf) {
      const message = await this.gmail.getMessage({
        id: this.messageId,
      });
      parts = this.collectParts(message.payload);
      part = this.resolvePart(parts);
    }
    if (filename && (path.basename(filename) !== filename || /[\\/]/.test(filename) || filename === "." || filename === "..")) {
      throw new ConfigurationError(`Invalid filename "${filename}" — must not contain path separators or traversal segments.`);
    }

    const attachment = await this.gmail.getAttachment({
      messageId: this.messageId,
      attachmentId: this.attachmentId,
    });
    let buffer = Buffer.from(attachment.data, "base64");
    if (!part) {
      const matches = parts.filter((p) => p.body?.attachmentId && p.body.size === buffer.length);
      part = matches.length === 1
        ? matches[0]
        : undefined;
    }
    const sniffedMimeType = this.sniffMimeType(buffer);
    if (!filename) {
      filename = part?.filename?.replace(/[\\/]/g, "_");
      if (!filename || filename === "." || filename === "..") {
        const extension = {
          "application/pdf": ".pdf",
          "image/png": ".png",
          "image/jpeg": ".jpg",
          "image/gif": ".gif",
        }[sniffedMimeType] || "";
        filename = `attachment-${this.attachmentId.slice(0, 8).replace(/[^A-Za-z0-9_-]/g, "_")}${extension}`;
      }
    }
    // Same-name parts that all share one MIME type still tell us how to convert, without picking one.
    const namedMimeTypes = [
      ...new Set(parts.filter((p) => this.filename && p.filename === this.filename).map((p) => p.mimeType)),
    ];
    const sourceMimeType = part?.mimeType
      || sniffedMimeType
      || (namedMimeTypes.length === 1
        ? namedMimeTypes[0]
        : undefined);
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
      } else {
        throw new ConfigurationError(`Cannot convert file type: ${sourceMimeType || "unknown (pass partId from the same read)"} to PDF`);
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

import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { PassThrough } from "stream";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import mammoth from "mammoth";
import gmail from "../../gmail.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "gmail-download-attachment",
  name: "Download Attachment",
  description:
    "Download a Gmail message attachment to `/tmp` and return its path + metadata. File Stash syncs the file and exposes a presigned download URL so the caller can retrieve it."
    + " Call **Find Emails** with `fields: [\"subject\", \"attachments\"]`, or **Get Thread**, first: each returned message lists its attachments as `attachments: [{ partId, filename, mimeType, size }]`. Pass the message's `id` as `messageId` and the attachment's `partId` as `partId`. This works for any message size, including large HTML emails whose `payload` is too big to return."
    + " Alternatively pass `attachmentId` from a message's `payload.parts[].body.attachmentId`. Provide `partId` or `attachmentId`; when both are given, `partId` is used."
    + " If `filename` is omitted, the action uses the attachment's own filename from the message."
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
    partId: {
      type: "string",
      label: "Part ID",
      description: "The attachment's `partId` from the message's `attachments` list, e.g. `1` or `0.2`. Get it from **Find Emails** with `fields: [\"subject\", \"attachments\"]`, or from **Get Thread**. Stable across reads of the message. Required unless `attachmentId` is set.",
      optional: true,
    },
    attachmentId: {
      type: "string",
      label: "Attachment ID",
      description: "The attachment's ID from a message's `payload.parts[].body.attachmentId` (returned by **Find Emails** with `format: \"full\"` and `payload` requested, or by **Get Thread**). Not needed when `partId` is set, and prefer `partId`: on large messages the `payload` holding this ID can be dropped to fit the response cap.",
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
    findPartByPartId(part, partId) {
      if (!part) return undefined;
      if (String(part.partId) === String(partId)) return part;
      for (const child of part.parts ?? []) {
        const found = this.findPartByPartId(child, partId);
        if (found) return found;
      }
      return undefined;
    },
    findPartByAttachmentId(parts, attachmentId) {
      for (const part of parts ?? []) {
        if (part.body?.attachmentId === attachmentId) {
          return part;
        }
        if (Array.isArray(part.parts)) {
          const nested = this.findPartByAttachmentId(part.parts, attachmentId);
          if (nested) return nested;
        }
      }
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
    const hasPartId = this.partId != null && String(this.partId).trim() !== "";
    if (!hasPartId && !this.attachmentId) {
      throw new ConfigurationError("Provide `partId` (from the message's `attachments` list in **Find Emails** or **Get Thread**) or `attachmentId`.");
    }
    let filename = this.filename;
    let sourceMimeType;
    let attachmentId = this.attachmentId;
    if (hasPartId) {
      // The attachment id comes from this read, so the caller never has to carry one.
      const partId = String(this.partId).trim();
      const message = await this.gmail.getMessage({
        id: this.messageId,
      });
      const part = this.findPartByPartId(message.payload, partId);
      if (!part?.body?.attachmentId) {
        const available = utils.getAttachments(message.payload)
          .map((attachment) => `${attachment.partId} (${attachment.filename})`)
          .join(", ");
        throw new ConfigurationError(`No attachment with partId \`${partId}\` in message ${this.messageId}. ${available
          ? `Attachments in this message: ${available}.`
          : "This message has no attachments."}`);
      }
      attachmentId = part.body.attachmentId;
      filename = filename || part.filename;
      sourceMimeType = part.mimeType;
    } else if (!filename || this.convertToPdf) {
      const message = await this.gmail.getMessage({
        id: this.messageId,
      });
      const rootPart = message.payload?.body?.attachmentId === this.attachmentId
        ? message.payload
        : undefined;
      const part = this.findPartByAttachmentId(message.payload?.parts, this.attachmentId)
        ?? rootPart;
      if (!part) {
        throw new ConfigurationError(`Attachment not found for messageId ${this.messageId} attachmentId ${this.attachmentId}. Ensure Find Emails was called with format: "full" so that payload.parts[] is populated.`);
      }
      filename = filename || part.filename;
      sourceMimeType = part.mimeType;
    }
    if (!filename) {
      filename = `attachment-${attachmentId.slice(0, 8)}`;
    }
    const safeFilename = path.basename(filename);
    if (safeFilename !== filename || safeFilename === "" || safeFilename === "." || safeFilename === "..") {
      throw new ConfigurationError(`Invalid filename "${filename}" — must not contain path separators or traversal segments.`);
    }
    filename = safeFilename;

    const attachment = await this.gmail.getAttachment({
      messageId: this.messageId,
      attachmentId,
    });
    let buffer = Buffer.from(attachment.data, "base64");

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

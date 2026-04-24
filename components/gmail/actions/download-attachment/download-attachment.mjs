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
    + " Call **Find Emails** or **Get Thread** first — each returned message's `payload.parts[]` enumerates attachments as `{ body.attachmentId, filename, mimeType }`. Pass the enclosing message's `id` as `messageId` and the part's `body.attachmentId` as `attachmentId`."
    + " If `filename` is omitted, the action looks up the attachment's filename from the message payload."
    + " Set `convertToPdf: true` to convert image / HTML / plain-text / DOCX attachments to PDF during download; other MIME types are rejected."
    + " [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.messages.attachments/get).",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
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
      description: "The attachment's ID. Find this on a message's `payload.parts[].body.attachmentId` from **Find Emails** or **Get Thread**.",
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
    let sourceMimeType;
    if (!filename || this.convertToPdf) {
      const message = await this.gmail.getMessage({
        id: this.messageId,
      });
      const parts = message.payload?.parts ?? [];
      const part = parts.find((p) => p.body?.attachmentId === this.attachmentId);
      if (part) {
        filename = filename || part.filename;
        sourceMimeType = part.mimeType;
      }
    }
    if (!filename) {
      filename = `attachment-${this.attachmentId.slice(0, 8)}`;
    }

    const attachment = await this.gmail.getAttachment({
      messageId: this.messageId,
      attachmentId: this.attachmentId,
    });
    let buffer = Buffer.from(attachment.data, "base64");

    if (this.convertToPdf && sourceMimeType !== "application/pdf") {
      if (sourceMimeType?.startsWith("image/")) {
        buffer = await this.imageToPdf(buffer);
      } else if (sourceMimeType === "text/html") {
        buffer = await this.htmlToPdf(buffer);
      } else if (sourceMimeType === "text/plain") {
        const textBuffer = Buffer.from(`<pre>${buffer.toString("utf8")}</pre>`, "utf8");
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

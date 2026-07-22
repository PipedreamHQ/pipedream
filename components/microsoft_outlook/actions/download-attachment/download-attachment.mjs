import fs from "fs";
import mime from "mime-types";
import path from "path";
import PDFDocument from "pdfkit";
import { PassThrough } from "stream";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import mammoth from "mammoth";
import { ConfigurationError } from "@pipedream/platform";
import microsoftOutlook from "../../microsoft_outlook.app.mjs";

// Cap inline file content so large attachments don't blow up the response payload
const MAX_CONTENT_BYTES = 100 * 1024;

export default {
  key: "microsoft_outlook-download-attachment",
  name: "Download Attachment",
  description:
    "Download an email attachment to `/tmp`."
    + " Use **Find Email** to locate the message, then **Get Message** with `includeAttachments: true` to get the `messageId` and attachment `id` fields."
    + " Example: after `get-message(messageId=\"AAMk...\", includeAttachments=true)` returns `attachments: [{ id: \"AQMk...\", name: \"report.pdf\" }]`, call `download-attachment(messageId=\"AAMk...\", attachmentId=\"AQMk...\", filename=\"report.pdf\")` → writes to `/tmp/report.pdf`."
    + " Set `convertToPdf: true` to convert images, HTML, plain text, or DOCX files to PDF."
    + " For text attachments (text/*, JSON), the response includes `fileContent` with the decoded text (truncated at 100 KB, flagged by `contentTruncated`), so the content can be read directly without fetching the file."
    + " [See the documentation](https://learn.microsoft.com/en-us/graph/api/attachment-get)",
  version: "0.1.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftOutlook,
    messageId: {
      type: "string",
      label: "Message ID",
      description: "The Microsoft Graph message ID. Obtain from **Find Email** or **Get Message**.",
    },
    attachmentId: {
      type: "string",
      label: "Attachment ID",
      description: "The attachment ID. Obtain from **Get Message** with `includeAttachments: true` — each attachment object in the response has an `id` field.",
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "The filename to save the attachment as in `/tmp`, e.g. `report.pdf`. If `convertToPdf` is true, the `.pdf` extension is applied automatically.",
    },
    convertToPdf: {
      type: "boolean",
      label: "Convert to PDF",
      description: "When `true`, converts the attachment to PDF before saving. Supports image, text/plain, HTML, and DOCX files.",
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The user ID or UPN of a shared mailbox. Omit to use the authenticated user's mailbox.",
      optional: true,
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
        stream.on("error", reject);
        doc.on("error", reject);
        stream.on("data", (c) => chunks.push(c));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
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
    const response = await this.microsoftOutlook.getAttachment({
      userId: this.userId,
      messageId: this.messageId,
      attachmentId: this.attachmentId,
    });

    let filename = this.filename;
    if (this.convertToPdf) {
      const name = path.parse(filename).name;
      filename = `${name}.pdf`;
    }

    let buffer = await this.microsoftOutlook.streamToBuffer(response);

    if (this.convertToPdf) {
      const { contentType: mimeType } = await this.microsoftOutlook.getAttachmentInfo({
        userId: this.userId,
        messageId: this.messageId,
        attachmentId: this.attachmentId,
      });
      if (mimeType !== "application/pdf") {
        if (mimeType?.startsWith("image/")) {
          buffer = await this.imageToPdf(buffer);
        } else if (mimeType === "text/html") {
          buffer = await this.htmlToPdf(buffer);
        } else if (mimeType === "text/plain") {
          const textBuffer = Buffer.from(`<pre>${buffer.toString("utf8")}</pre>`, "utf8");
          buffer = await this.htmlToPdf(textBuffer);
        } else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          const { value: html } = await mammoth.convertToHtml({
            buffer,
          });
          buffer = await this.htmlToPdf(html);
        } else {
          throw new ConfigurationError(`Cannot convert file type: ${mimeType} to PDF`);
        }
      }
    }

    const filePath = `${process.env.STASH_DIR || "/tmp"}/${filename}`;
    fs.writeFileSync(filePath, buffer);
    const contentType = mime.lookup(filePath);

    const result = {
      fileName: filename,
      contentType,
      filePath,
    };

    const isTextContent = contentType
      && (contentType.startsWith("text/") || contentType === "application/json");
    if (isTextContent) {
      result.fileContent = buffer.toString("utf8", 0, Math.min(buffer.length, MAX_CONTENT_BYTES));
      if (buffer.length > MAX_CONTENT_BYTES) {
        result.contentTruncated = true;
      }
    }

    $.export("$summary", `Downloaded ${filename}`);
    return result;
  },
};

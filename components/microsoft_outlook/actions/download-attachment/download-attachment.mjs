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

export default {
  key: "microsoft_outlook-download-attachment",
  name: "Download Attachment",
  description: "Downloads an attachment to the /tmp directory. [See the documentation](https://learn.microsoft.com/en-us/graph/api/attachment-get?view=graph-rest-1.0&tabs=http)",
  version: "0.0.10",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    microsoftOutlook,
    messageId: {
      propDefinition: [
        microsoftOutlook,
        "messageId",
      ],
      description: "The identifier of the message containing the attachment to download",
    },
    attachmentId: {
      propDefinition: [
        microsoftOutlook,
        "attachmentId",
        (c) => ({
          messageId: c.messageId,
        }),
      ],
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "The filename to save the attachment as in the /tmp directory",
    },
    convertToPdf: {
      type: "boolean",
      label: "Convert to PDF",
      description: "Whether to convert the attachment to a PDF file. Supports converting image, text, HTML, and DOCX files.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  methods: {
    getAttachmentInfo({
      messageId, attachmentId, ...args
    }) {
      return this.microsoftOutlook._makeRequest({
        path: `/me/messages/${messageId}/attachments/${attachmentId}`,
        ...args,
      });
    },
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
      $,
      messageId: this.messageId,
      attachmentId: this.attachmentId,
      responseType: "arraybuffer",
    });

    let filename = this.filename;
    if (this.convertToPdf) {
      const name = path.parse(filename).name;
      filename = `${name}.pdf`;
    }

    const rawcontent = response.toString("base64");
    let buffer = Buffer.from(rawcontent, "base64");

    if (this.convertToPdf) {
      const { contentType: mimeType } = await this.getAttachmentInfo({
        $,
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

    const downloadedFilepath = `/tmp/${filename}`;
    fs.writeFileSync(downloadedFilepath, buffer);
    const contentType = mime.lookup(downloadedFilepath);

    return {
      fileName: filename,
      contentType,
      filePath: downloadedFilepath,
    };
  },
};

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
  description: "Download an attachment by attachmentId to the /tmp directory. [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.messages.attachments/get)",
  version: "0.0.16",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    gmail,
    messageId: {
      propDefinition: [
        gmail,
        "messageWithAttachments",
      ],
    },
    attachmentId: {
      propDefinition: [
        gmail,
        "attachmentId",
        ({ messageId }) => ({
          messageId,
        }),
      ],
      withLabel: true,
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "Name of the new file. Example: `test.jpg`",
      optional: true,
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
    const attachmentId = this.attachmentId.value || this.attachmentId;

    const attachment = await this.gmail.getAttachment({
      messageId: this.messageId,
      attachmentId,
    });

    let filename = this.filename || this.attachmentId.label;

    if (!filename) {
      throw new ConfigurationError("Please enter a filename to save the downloaded file as in the `/tmp` directory.");
    }

    const name = path.parse(filename).name;

    if (this.convertToPdf) {
      filename = `${name}.pdf`;
    }

    const filePath = path.join("/tmp", filename);
    let buffer = Buffer.from(attachment.data, "base64");

    if (this.convertToPdf) {
      // get original mime type
      const { payload: { parts } } = await this.gmail.getMessage({
        $,
        id: this.messageId,
      });
      const attachmentInfo = parts.find(({ filename }) => filename.startsWith(name));
      const mimeType = attachmentInfo.mimeType;

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

    fs.writeFileSync(filePath, buffer);

    $.export("$summary", `Successfully created file ${filename} in \`/tmp\` directory`);

    return {
      filename,
      filePath,
    };
  },
};

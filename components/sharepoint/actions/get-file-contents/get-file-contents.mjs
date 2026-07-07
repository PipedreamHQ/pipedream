import path from "path";
import mammoth from "mammoth";
import TurndownService from "turndown";
import { PDFParse } from "pdf-parse";
import { ConfigurationError } from "@pipedream/platform";
import sharepoint from "../../sharepoint.app.mjs";
import constants from "../../common/constants.mjs";

const DOCX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const PDF_MIME_TYPE = "application/pdf";
const HTML_MIME_TYPES = [
  "text/html",
  "application/xhtml+xml",
];
const TEXT_LIKE_MIME_TYPES = [
  "application/json",
  "application/xml",
  "application/javascript",
  "application/x-yaml",
  "application/yaml",
];

export default {
  key: "sharepoint-get-file-contents",
  name: "Get File Contents",
  description: "Retrieves a Microsoft SharePoint file and returns its contents as extracted plain text or markdown. Supports plain text formats, HTML, DOCX, PDF, and other Office documents convertible to PDF (xlsx, pptx, etc.). [See the documentation](https://learn.microsoft.com/en-us/graph/api/driveitem-get-content?view=graph-rest-1.0&tabs=http)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sharepoint,
    siteId: {
      propDefinition: [
        sharepoint,
        "siteId",
      ],
    },
    driveId: {
      propDefinition: [
        sharepoint,
        "driveId",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
    fileId: {
      propDefinition: [
        sharepoint,
        "fileId",
        (c) => ({
          siteId: c.siteId,
          driveId: c.driveId,
        }),
      ],
    },
    maxChars: {
      type: "integer",
      label: "Max Characters",
      description: "Maximum number of characters of extracted text to return. If the content is longer, it will be truncated and `truncated` will be set to `true`. Leave blank to return the full content.",
      optional: true,
    },
  },
  methods: {
    async fetchAsBuffer({ format } = {}) {
      const stream = await this.sharepoint.getFile({
        driveId: this.driveId,
        fileId: this.fileId,
        params: format
          ? {
            format,
          }
          : {},
      });
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    },
    htmlToMarkdown(html) {
      const turndown = new TurndownService({
        headingStyle: "atx",
        codeBlockStyle: "fenced",
      });
      return turndown.turndown(html);
    },
    isTextLikeMimeType(mimeType) {
      if (!mimeType) return false;
      return /^text\//i.test(mimeType) || TEXT_LIKE_MIME_TYPES.includes(mimeType);
    },
    async extractText({
      mimeType, extension,
    }) {
      if (this.isTextLikeMimeType(mimeType)) {
        const buffer = await this.fetchAsBuffer();
        if (HTML_MIME_TYPES.includes(mimeType)) {
          return this.htmlToMarkdown(buffer.toString("utf8"));
        }
        return buffer.toString("utf8");
      }
      if (mimeType === DOCX_MIME_TYPE || extension === "docx") {
        const buffer = await this.fetchAsBuffer();
        const { value: html } = await mammoth.convertToHtml({
          buffer,
        });
        return this.htmlToMarkdown(html);
      }
      if (mimeType === PDF_MIME_TYPE || extension === "pdf") {
        const buffer = await this.fetchAsBuffer();
        const { text } = await new PDFParse({
          data: buffer,
        }).getText();
        return text;
      }
      if (extension && constants.PDF_CONVERTIBLE_FORMATS.includes(extension)) {
        const buffer = await this.fetchAsBuffer({
          format: "pdf",
        });
        const { text } = await new PDFParse({
          data: buffer,
        }).getText();
        return text;
      }
      throw new ConfigurationError(`Unsupported file type for text extraction (mime type: ${mimeType || "unknown"}, extension: ${extension || "unknown"})`);
    },
  },
  async run({ $ }) {
    const driveItem = await this.sharepoint.getDriveItem({
      $,
      driveId: this.driveId,
      siteId: this.siteId,
      fileId: this.fileId,
    });

    const filename = driveItem.name || "";
    const mimeType = driveItem.file?.mimeType;
    const extension = path.extname(filename).slice(1)
      .toLowerCase() || undefined;

    const fullText = await this.extractText({
      mimeType,
      extension,
    });

    const contentLength = fullText.length;
    const truncated = !!(Number.isInteger(this.maxChars) && contentLength > this.maxChars);
    const text = truncated
      ? fullText.slice(0, this.maxChars)
      : fullText;

    $.export(
      "$summary",
      `Successfully extracted ${contentLength} character${contentLength === 1
        ? ""
        : "s"} from ${filename}${truncated
        ? " (truncated)"
        : ""}`,
    );

    return {
      filename,
      text,
      truncated,
      contentLength,
      mimeType,
    };
  },
};

import app from "../../pdfgate.app.mjs";
import {
  DOCS_URLS, PROCESS_TIMEOUT_MS, WATERMARK_FONT_OPTIONS,
} from "../../common/constants.mjs";
import {
  buildCommonFields, omitBlank, toNumber,
} from "../../common/utils.mjs";

export default {
  key: "pdfgate-watermark-pdf",
  name: "Watermark PDF",
  description: `Overlay a text watermark on every page of a stored PDF and save the result as a new PDFGate document. Use it to mark drafts or confidential copies before sharing; the original document is left unchanged. [See the documentation](${DOCS_URLS.watermarkPdf})`,
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    documentId: {
      propDefinition: [
        app,
        "documentId",
      ],
    },
    text: {
      type: "string",
      label: "Watermark Text",
      description: "Text to overlay on each page, e.g. `CONFIDENTIAL` or `DRAFT`.",
    },
    fontSize: {
      type: "integer",
      label: "Font Size (pt)",
      description: "Font size in points, e.g. `48`.",
      optional: true,
    },
    fontColor: {
      type: "string",
      label: "Font Color",
      description: "Text colour as hex or rgb, e.g. `#FF0000` or `rgb(255,0,0)`.",
      optional: true,
    },
    font: {
      type: "string",
      label: "Font",
      description: "Watermark font, e.g. `helvetica-bold`.",
      optional: true,
      options: WATERMARK_FONT_OPTIONS,
    },
    opacity: {
      type: "string",
      label: "Opacity",
      description: "Transparency from `0` (invisible) to `1` (opaque), e.g. `0.3`.",
      optional: true,
    },
    rotate: {
      type: "string",
      label: "Rotation (degrees)",
      description: "Rotation angle in degrees between `0` and `360`, e.g. `45` for a diagonal watermark.",
      optional: true,
    },
    xPosition: {
      type: "integer",
      label: "X Position (points)",
      description: "Horizontal position in points from the left edge, e.g. `100`. Empty centres the watermark horizontally.",
      optional: true,
    },
    yPosition: {
      type: "integer",
      label: "Y Position (points)",
      description: "Vertical position in points from the bottom edge, e.g. `400`. Empty centres the watermark vertically.",
      optional: true,
    },
    preSignedUrlExpiresIn: {
      propDefinition: [
        app,
        "preSignedUrlExpiresIn",
      ],
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.watermarkPdf({
      $,
      data: {
        documentId: this.documentId,
        type: "text",
        text: this.text,
        jsonResponse: true,
        ...omitBlank({
          fontSize: this.fontSize,
          fontColor: this.fontColor,
          font: this.font,
          opacity: toNumber(this.opacity, "Opacity", 0, 1),
          rotate: toNumber(this.rotate, "Rotation (degrees)", 0, 360),
          xPosition: this.xPosition,
          yPosition: this.yPosition,
        }),
        ...buildCommonFields(this),
      },
      timeout: PROCESS_TIMEOUT_MS,
    });
    $.export("$summary", `Successfully watermarked document ${this.documentId} into document ${response.id}`);
    return response;
  },
};

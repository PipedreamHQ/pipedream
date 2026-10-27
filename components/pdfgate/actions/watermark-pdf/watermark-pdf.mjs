import { ConfigurationError } from "@pipedream/platform";
import app from "../../pdfgate.app.mjs";
import {
  DOCS_URL, PROCESS_TIMEOUT_MS, WATERMARK_FONT_OPTIONS,
} from "../../common/constants.mjs";
import {
  buildCommonFields, omitBlank,
} from "../../common/utils.mjs";

const toNumber = (value, label) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const num = Number(value);
  if (Number.isNaN(num)) {
    throw new ConfigurationError(`**${label}** must be a number.`);
  }
  return num;
};

export default {
  key: "pdfgate-watermark-pdf",
  name: "Watermark PDF",
  description: `Apply a text watermark to a PDF. [See the documentation](${DOCS_URL})`,
  version: "0.0.1",
  type: "action",
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
      description: "The text to overlay on the PDF as a watermark.",
    },
    fontSize: {
      type: "integer",
      label: "Font Size (pt)",
      description: "Text watermark font size in points.",
      optional: true,
    },
    fontColor: {
      type: "string",
      label: "Font Color",
      description: "Text color as hex (e.g. `#FF0000`) or rgb (e.g. `rgb(255,0,0)`).",
      optional: true,
    },
    font: {
      type: "string",
      label: "Font",
      description: "Watermark font.",
      optional: true,
      options: WATERMARK_FONT_OPTIONS,
    },
    opacity: {
      type: "string",
      label: "Opacity",
      description: "Transparency from `0` (invisible) to `1` (opaque).",
      optional: true,
    },
    rotate: {
      type: "string",
      label: "Rotation (degrees)",
      description: "Rotation angle of the watermark in degrees. Use a value between `0` and `360`.",
      optional: true,
    },
    xPosition: {
      type: "integer",
      label: "X Position (points)",
      description: "Horizontal position in points. If empty, the watermark is centered horizontally.",
      optional: true,
    },
    yPosition: {
      type: "integer",
      label: "Y Position (points)",
      description: "Vertical position in points. If empty, the watermark is centered vertically.",
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
          opacity: toNumber(this.opacity, "Opacity"),
          rotate: toNumber(this.rotate, "Rotation (degrees)"),
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

import codeqr from "../../codeqr.app.mjs";

export default {
  key: "codeqr-create-qrcode",
  name: "Create a QR Code",
  description:
    "Creates a new QR Code in CodeQR using the QR Codes API. [See the documentation](https://codeqr.mintlify.app/api-reference/endpoint/create-a-qrcode)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    codeqr,
    type: {
      type: "string",
      label: "QR Code Type",
      description: "Select the type of QR Code to generate.",
      options: [
        "url",
        "text",
      ],
      optional: false,
    },
    static: {
      type: "boolean",
      label: "Static/Dynamic",
      description:
        "Yes = Static QR Code (fixed content); No = Dynamic QR Code (editable content).",
      optional: false,
      default: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "The destination URL of the QR Code.",
      optional: true,
    },
    text: {
      type: "string",
      label: "Text",
      description: "Text content stored in the QR Code.",
      optional: true,
    },
    trackConversion: {
      type: "boolean",
      label: "Track Conversion",
      description:
        "Enable tracking of conversions for the QR Code. Only available for dynamic QR Codes.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title associated with the QR Code.",
      optional: true,
    },
    bgColor: {
      type: "string",
      label: "Background Color",
      description: "Background color of the QR Code.",
      optional: true,
    },
    fgColor: {
      type: "string",
      label: "Foreground Color",
      description: "Foreground color of the QR Code.",
      optional: true,
    },
    showLogo: {
      type: "boolean",
      label: "Show Logo",
      description: "Whether to display a logo in the QR Code.",
      optional: true,
    },
    src: {
      type: "string",
      label: "Logo URL",
      description:
        "URL of the logo to display in the QR Code (only if Show Logo is true).",
      optional: true,
    },
    comments: {
      type: "string",
      label: "Comments",
      description: "Comments or notes about the QR Code.",
      optional: true,
    },
    expiresAt: {
      type: "string",
      label: "Expiration Date",
      description:
        "The date and time when the short link will expire (ISO 8601). Only available for dynamic QR Codes. E.g. `2025-06-13T05:31:56Z`",
      optional: true,
    },
    expiredUrl: {
      type: "string",
      label: "Expired Redirect URL",
      description:
        "The URL to redirect to when the short link has expired. Only available for dynamic QR Codes.",
      optional: true,
    },
  },
  async run({ $ }) {
    const payload = {};
    for (const key of [
      "type",
      "static",
      "url",
      "text",
      "trackConversion",
      "title",
      "bgColor",
      "fgColor",
      "showLogo",
      "src",
      "comments",
      "expiresAt",
      "expiredUrl",
    ]) {
      if (this[key] != null) payload[key] = this[key];
    }

    const response = await this.codeqr.createQrcode({
      $,
      data: payload,
    });
    $.export("$summary", "QR Code created successfully.");
    return response;
  },
};

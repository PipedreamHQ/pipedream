import codeqr from "../../codeqr.app.mjs";

export default {
  key: "codeqr-create-qrcode",
  name: "Create a QR Code",
  description: "Creates a new QR Code in CodeQR using the QR Codes API. [See the documentation](https://codeqr.mintlify.app/api-reference/endpoint/create-a-qrcode)",
  version: "0.0.1",
  type: "action",
  props: {
    codeqr,
    type: {
      type: "string",
      label: "QR Code Type",
      description: "Select the type of QR Code to generate.",
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
    text: {
      type: "string",
      label: "Text",
      description: "Text content stored in the QR Code.",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "The destination URL of the QR Code.",
      optional: true,
    },
    email: {
      type: "object",
      label: "Email",
      description: "Email data for email-based QR Codes (JSON format).",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number stored in the QR Code.",
      optional: true,
    },
    expiresAt: {
      type: "string",
      label: "Expiration Date",
      description: "Expiration date of the QR Code (ISO 8601).",
      optional: true,
    },
    trackConversion: {
      type: "boolean",
      label: "Track Conversion",
      description: "Enable tracking of conversions for the QR Code.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title associated with the QR Code.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description associated with the QR Code.",
      optional: true,
    },
    image: {
      type: "string",
      label: "Image URL",
      description: "URL of an image associated with the QR Code.",
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
    size: {
      type: "integer",
      label: "Size",
      description: "Size of the QR Code in pixels.",
      optional: true,
    },
    showLogo: {
      type: "boolean",
      label: "Show Logo",
      description: "Whether to display a logo in the QR Code.",
      optional: true,
    },
    publicStats: {
      type: "boolean",
      label: "Public Stats",
      description: "Whether the QR Code statistics are publicly accessible.",
      optional: true,
    },
  },
  async run({ $ }) {
    const payload = {};
    for (const key of [
      "type",
      "static",
      "text",
      "url",
      "phone",
      "expiresAt",
      "trackConversion",
      "title",
      "description",
      "image",
      "bgColor",
      "fgColor",
      "size",
      "showLogo",
      "publicStats",
    ]) {
      if (this[key] != null) payload[key] = this[key];
    }

    if (this.email) {
      payload.email = typeof this.email === "string"
        ? JSON.parse(this.email)
        : this.email;
    }

    const response = await this.codeqr.createQrcode({
      $,
      data: payload,
    });
    $.export("$summary", "QR Code created successfully.");
    return response;
  },
};

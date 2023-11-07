import codereadr from "../../codereadr.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "codereadr-generate-qr-code",
  name: "Generate QR Code",
  description: "Generates a unique QR code. [See the documentation](https://secure.codereadr.com/apidocs/barcodegenerator.md)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    codereadr,
    databaseId: {
      propDefinition: [
        codereadr,
        "databaseId",
      ],
    },
    value: {
      type: "string",
      label: "Value",
      description: "The value to encode in the QR code",
    },
    symbology: {
      type: "string",
      label: "Symbology",
      description: "The type of barcode to generate",
      default: "qrcode",
      options: [
        {
          label: "QR Code",
          value: "qrcode",
        },
      ],
    },
    size: {
      type: "integer",
      label: "Size",
      description: "The size of the QR code (e.g., 300 for a 300x300 QR code)",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      value: this.value,
      symbology: this.symbology,
    };

    if (this.size) {
      data.size = this.size;
    }

    const response = await this.codereadr.generateQRCode({
      database_id: this.databaseId,
      ...data,
    });

    $.export("$summary", `Successfully generated QR code with value: ${this.value}`);
    return response;
  },
};

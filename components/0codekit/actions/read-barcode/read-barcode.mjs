import { axios } from "@pipedream/platform";
import qrPdfApp from "../../qr_pdf_app.app.mjs";

export default {
  key: "0codekit-read-barcode",
  name: "Read Barcode",
  description: "Reads a QR code from an image. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    qrPdfApp,
    imageUrl: {
      propDefinition: [
        qrPdfApp,
        "imageUrl",
      ],
    },
  },
  async run({ $ }) {
    const qrCodeData = await this.qrPdfApp.readQrCode({
      imageUrl: this.imageUrl,
    });
    $.export("$summary", `Successfully read QR code from image: ${this.imageUrl}`);
    return qrCodeData;
  },
};

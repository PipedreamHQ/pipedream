import app from "../../pdf_co.app.mjs";

export default {
  name: "Barcode Generator",
  description: "Generate high quality barcode images. Supports QR Code, Datamatrix, Code 39, Code 128, PDF417 and many other barcode types. [See docs here](https://apidocs.pdf.co/40-barcode-generator?utm_referer=https://app.pdf.co/#post-barcodegenerate)",
  key: "pdf_co-barcode-generator",
  version: "0.0.3",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const param = {
      "name": "barcode.png",
      "value": "abcdef123456",
      "type": "QRCode",
      "async": false,
    };
    const response = await this.app.generateBarcode(
      $,
      param,
    );
    $.export("$summary", `Successfully generated barcode from: ${param.value}`);
    return response;
  },
};

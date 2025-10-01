import _0codekit from "../../_0codekit.app.mjs";

export default {
  key: "_0codekit-read-barcode",
  name: "Read Barcode",
  description: "Reads a QR code from an image. [See the documentation](https://documenter.getpostman.com/view/18297710/UVkntwBv#84ecd80e-af50-406b-abd7-698826773500)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    _0codekit,
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "The URL of the image containing the QR code to be read",
    },
  },
  async run({ $ }) {
    const qrCodeData = await this._0codekit.readQrCode({
      $,
      data: {
        url: this.imageUrl,
      },
    });
    $.export("$summary", `Successfully read QR code from image: ${this.imageUrl}`);
    return qrCodeData;
  },
};

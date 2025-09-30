import app from "../../urlbae.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Create QRCode",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "urlbae-create-qrcode",
  description: "Creates a qrcode. [See the documentation](https://urlbae.com/developers#create-a-qr-code)",
  type: "action",
  props: {
    app,
    type: {
      type: "string",
      label: "Type",
      description: "Type of the data to be embedded in the QR code",
      options: constants.DATA_TYPES,
    },
    data: {
      type: "string",
      label: "Data",
      description: "Data to be embedded inside the QR code",
    },
    background: {
      type: "string",
      label: "Background",
      description: "RGB color of the background. E.g. `rgb(255,255,255)`",
      optional: true,
    },
    foreground: {
      type: "string",
      label: "Foreground",
      description: "RGB color of the foreground. E.g. `rgb(255,255,255)`",
      optional: true,
    },
    logo: {
      type: "string",
      label: "Logo",
      description: "URL to the png or jpg logo",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createQrcode({
      $,
      data: {
        type: this.type,
        data: this.data,
        background: this.background,
        foreground: this.foreground,
        logo: this.logo,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created QRCode with ID ${response.id}`);
    }

    return response;
  },
};

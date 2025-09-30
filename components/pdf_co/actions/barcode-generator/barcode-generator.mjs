import app from "../../pdf_co.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Barcode Generator",
  description: "Generate high quality barcode images. Supports QR Code, DataMatrix, Code 39, Code 128, PDF417 and many other barcode types. [See docs here](https://apidocs.pdf.co/40-barcode-generator)",
  key: "pdf_co-barcode-generator",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    value: {
      type: "string",
      label: "Value",
      description: "Sets the value to be converted to the barcode.",
      optional: false,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Sets barcode type. QRCode is default.",
      options: constants.BARCODE_GENERATOR_TYPE_OPTS,
      optional: true,
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    expiration: {
      propDefinition: [
        app,
        "expiration",
      ],
    },
    inline: {
      propDefinition: [
        app,
        "inline",
      ],
    },
    decorationImage: {
      type: "string",
      label: "Decoration Image",
      description: "Expects a public URL. Works for QR Code only. Set this to the image that you want to be inserted logo inside QR Code barcode.",
      optional: true,
    },
    async: {
      propDefinition: [
        app,
        "async",
      ],
    },
    profiles: {
      propDefinition: [
        app,
        "profiles",
      ],
    },
  },
  async run({ $ }) {
    const param = {
      value: this.value,
      type: this.type,
      name: this.name,
      expiration: this.expiration,
      inline: this.inline,
      decorationImage: this.decorationImage,
      async: this.async,
      profiles: this.profiles,
    };
    const response = await this.app.generateBarcode(
      $,
      param,
    );
    $.export("$summary", `Successfully generated barcode from: ${param.value}`);
    return response;
  },
};

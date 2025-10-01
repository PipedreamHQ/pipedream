import app from "../../codereadr.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "codereadr-generate-qr-code",
  name: "Generate QR Code",
  description: "Generates a unique QR code. [See the documentation](https://secure.codereadr.com/apidocs/BarcodeGenerator.md#generate)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    value: {
      propDefinition: [
        app,
        "value",
      ],
    },
    barcodeType: {
      type: "string",
      label: "Barcode Type",
      description: "The desired format of your outputted barcode. Set to `qr` by default.",
      options: [
        "qr",
        "pdf417",
      ],
      optional: true,
    },
    size: {
      type: "integer",
      label: "Size",
      description: "An integer between 1 and 10 which specifies the dimensions of your barcode in 50px increments. (Examples: `1` = 50px, `2` = 100px, `10` = 500px).",
      min: 1,
      max: 10,
      optional: true,
    },
  },
  methods: {
    generateBarcode({
      params, ...args
    } = {}) {
      return this.app.generate({
        subdomain: constants.SUBDOMAIN.BARCODE,
        params: {
          ...params,
          section: "barcode",
        },
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      generateBarcode,
      value,
      barcodeType,
      size,
    } = this;

    const response = await generateBarcode({
      $,
      onlyXml: true,
      responseType: "arraybuffer",
      params: {
        value,
        barcodetype: barcodeType,
        size,
      },
    });

    $.export("$summary", "Successfully generated QR code");

    return response;
  },
};

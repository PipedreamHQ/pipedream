import app from "../../pdf_co.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Barcode Reader",
  description: "Read barcodes from images and PDF. Can read all popular barcode types from QR Code and Code 128, EAN to DataMatrix, PDF417, GS1 and many other barcodes. [See docs here](https://apidocs.pdf.co/41-barcode-reader)",
  key: "pdf_co-barcode-reader",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
    types: {
      type: "string[]",
      label: "Type",
      description: "List of barcode types to decode.",
      options: constants.BARCODE_READER_TYPE_OPTS,
    },
    httpusername: {
      propDefinition: [
        app,
        "httpusername",
      ],
    },
    httppassword: {
      propDefinition: [
        app,
        "httppassword",
      ],
    },
    pages: {
      propDefinition: [
        app,
        "pages",
      ],
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
      url: this.url,
      types: this.types?.join(", "),
      httpusername: this.httpusername,
      httppassword: this.httppassword,
      pages: this.pages,
      async: this.async,
      profiles: this.profiles,
    };
    const response = await this.app.readBarcode(
      $,
      param,
    );
    $.export("$summary", `Successfully parsed barcode from: ${param.url}`);
    return response;
  },
};

import app from "../../pdf_co.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Barcode Reader",
  description: "Read barcodes from images and PDF. Can read all popular barcode types from QR Code and Code 128, EAN to DataMatrix, PDF417, GS1 and many other barcodes. [See docs here](https://apidocs.pdf.co/41-barcode-reader)",
  key: "pdf_co-barcode-reader",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    url: {
      type: "string",
      label: "URL",
      description: "URL to the source file. Supports links from Google Drive, Dropbox and from built-in PDF.co files storage.",
      optional: false,
    },
    types: {
      type: "string[]",
      label: "Type",
      description: "List of barcode types to decode.",
      options: constants.BARCODE_READER_TYPE_OPTS,
    },
    httpusername: {
      type: "string",
      label: "HTTP Username",
      description: "HTTP auth user name if required to access source url.",
      optional: true,
    },
    httppassword: {
      type: "string",
      label: "HTTP Password",
      description: "HTTP auth password if required to access source url.",
      optional: true,
    },
    pages: {
      type: "string",
      label: "Pages",
      description: "For ALL pages just leave this param empty. Comma-separated list of page indices (or ranges) to process. the very first page starts at 0 (zero). To set a range use the dash -, for example: 0,2-5,7-. To set a range from index to the last page use range like this: 2- (from page #3 as the index starts at zero and till the end of the document). Example: 0,2-5,7- means first page, then 3rd page to 6th page, and then the range from 8th (index = 7) page till the end of the document.",
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

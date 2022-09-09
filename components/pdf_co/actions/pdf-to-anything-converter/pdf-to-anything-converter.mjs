import app from "../../pdf_co.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "PDF to Anything Converter",
  description: "Convert PDF to CSV, JSON, Text, XLS, XLSX [See docs here](https://apidocs.pdf.co/12-pdf-to-csv)",
  key: "pdf_co-pdf-to-anything-converter",
  version: "0.0.9",
  type: "action",
  props: {
    app,
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
    profiles: {
      propDefinition: [
        app,
        "profiles",
      ],
    },
    unwrap: {
      type: "boolean",
      label: "Unwrap",
      description: "Unwrap lines into a single line within table cells when lineGrouping is enabled.",
      optional: true,
    },
    rect: {
      type: "string",
      label: "Rect",
      description: "Defines coordinates for extraction, e.g. 51.8, 114.8, 235.5, 204.0.",
      optional: true,
    },
    lang: {
      type: "string",
      label: "Lang",
      description: "Sets language for OCR (text from image) to use for scanned PDF, PNG, JPG documents input when extracting text. Default is “eng”. Other languages are also supported: deu, spa, chi_sim, jpn and many others (full list of supported OCR languages is (here)[https://apidocs.pdf.co/kb/OCR/list-of-supported-languages-for-ocr]. You can also use 2 languages simultaneously like this: eng+deu or jpn+kor (any combination).",
      optional: true,
    },
    inline: {
      propDefinition: [
        app,
        "inline",
      ],
    },
    lineGrouping: {
      type: "boolean",
      label: "Line Grouping",
      description: "Line grouping within table cells.",
      optional: true,
    },
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
    outputType: {
      type: "string",
      label: "Output Type",
      description: "Select the output type.",
      options: constants.PDF_TO_ANYTHING_OUTPUT_TYPES,
    },
  },
  async run({ $ }) {
    const param = {
      url: this.url,
      httpusername: this.httpusername,
      httppassword: this.httppassword,
      pages: this.pages,
      unwrap: this.unwrap,
      rect: this.rect,
      lang: this.lang,
      inline: this.inline,
      lineGrouping: this.lineGrouping,
      async: this.async,
      name: this.name,
      expiration: this.expiration,
      profiles: this.profiles,
    };
    const response = await this.app.genericRequest(
      $,
      param,
      this.outputType,
    );
    $.export("$summary", `Successfully converted PDF to ${this.outputType}`);
    return response;
  },
};

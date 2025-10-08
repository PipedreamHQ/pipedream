import app from "../../pdf_co.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Document Parser",
  description: "Document Parser can automatically parse PDF, JPG, PNG document to extract fields, tables, values, barcodes from invoices, statements, orders and other PDF and scanned documents. [See docs here](https://apidocs.pdf.co/01-document-parser)",
  key: "pdf_co-document-parser",
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
    outputFormat: {
      type: "string",
      label: "Output Format",
      description: "Default is JSON. You can override default output format to CSV or XML to generate CSV or XML output accordingly.",
      options: constants.DOCUMENT_PARSER_OUTPUT_FORMAT,
      optional: true,
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
    password: {
      propDefinition: [
        app,
        "password",
      ],
    },
    inline: {
      propDefinition: [
        app,
        "inline",
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
    const payload = {
      url: this.url,
      httpusername: this.httpusername,
      httppassword: this.httppassword,
      outputFormat: this.outputFormat,
      inline: this.inline,
      password: this.password,
      async: this.async,
      name: this.name,
      expiration: this.expiration,
      profiles: this.profiles,
    };
    const endpoint = "/pdf/documentparser";
    const response = await this.app.genericRequest(
      $,
      payload,
      endpoint,
    );
    $.export("$summary", `Successfully parsed PDF from: ${this.url}`);
    return response;
  },
};

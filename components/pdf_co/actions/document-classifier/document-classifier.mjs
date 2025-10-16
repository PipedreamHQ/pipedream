import app from "../../pdf_co.app.mjs";

export default {
  name: "Document Classifier",
  description: "Auto classification of incoming documents. [See docs here](https://apidocs.pdf.co/01-1-document-classifier)",
  key: "pdf_co-document-classifier",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    rulescsv: {
      type: "string",
      label: "Rules CSV",
      description: "Define custom classification rules in CSV format. [learn more](https://apidocs.pdf.co/01-1-document-classifier)",
      optional: true,
    },
    caseSensitive: {
      propDefinition: [
        app,
        "caseSensitive",
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
      rulescsv: this.rulescsv,
      caseSensitive: this.caseSensitive,
      inline: this.inline,
      password: this.password,
      async: this.async,
      name: this.name,
      expiration: this.expiration,
      profiles: this.profiles,
    };
    const endpoint = "/pdf/classifier";
    const response = await this.app.genericRequest(
      $,
      payload,
      endpoint,
    );
    $.export("$summary", `Successfully classified PDF from: ${this.url}`);
    return response;
  },
};

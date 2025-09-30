import app from "../../pdf_co.app.mjs";

export default {
  name: "Document Toggle Searchable",
  description: "Turn PDF and scanned JPG, PNG images into text-searchable PDF or text-unsearchable. [See docs here](https://apidocs.pdf.co/11-pdf-make-text-searchable-or-unsearchable)",
  key: "pdf_co-document-toggle-searchable",
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
    setSearchable: {
      type: "boolean",
      label: "Set Searchable",
      description: "Select if the document should be searchable.",
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
    lang: {
      propDefinition: [
        app,
        "lang",
      ],
    },
    pages: {
      propDefinition: [
        app,
        "pages",
      ],
    },
    password: {
      propDefinition: [
        app,
        "password",
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
  },
  async run({ $ }) {
    const payload = {
      url: this.url,
      httpusername: this.httpusername,
      httppassword: this.httppassword,
      lang: this.lang,
      pages: this.pages,
      password: this.password,
      async: this.async,
      name: this.name,
      expiration: this.expiration,
      profiles: this.profiles,
    };
    const endpoint = this.setSearchable ?
      "/pdf/makesearchable"
      : "/pdf/makeunsearchable";
    const response = await this.app.genericRequest(
      $,
      payload,
      endpoint,
    );

    const isSetSearchable = this.setSearchable ?
      "searchable"
      : "unsearchable";
    $.export("$summary", `Successfully changed the PDF to ${isSetSearchable}`);
    return response;
  },
};

import app from "../../pdf_co.app.mjs";

export default {
  name: "PDF Find Table",
  description: "AI powered document analysis can scan your document for tables and return the array of tables on pages with coordinates and information about columns detected in these tables. [See docs here](https://apidocs.pdf.co/07-1-pdf-find-table)",
  key: "pdf_co-pdf-find-table",
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
    pages: {
      propDefinition: [
        app,
        "pages",
      ],
    },
    inline: {
      propDefinition: [
        app,
        "inline",
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
      async: this.async,
      profiles: this.profiles,
      password: this.password,
      inline: this.inline,
      name: this.name,
      expiration: this.expiration,
      pages: this.pages,
    };
    const endpoint = "/pdf/find/table";
    const response = await this.app.genericRequest(
      $,
      payload,
      endpoint,
    );
    $.export("$summary", `Successfully found tables from: ${this.url}`);
    return response;
  },
};

import app from "../../pdf_co.app.mjs";

export default {
  name: "PDF Split by Page Index",
  description: "Split PDF by page index. [See docs here](https://apidocs.pdf.co/30-pdf-split)",
  key: "pdf_co-pdf-split-by-pages",
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
    pages: {
      propDefinition: [
        app,
        "pages",
      ],
      optional: false,
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
    inline: {
      propDefinition: [
        app,
        "inline",
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
      inline: this.inline,
      name: this.name,
      expiration: this.expiration,
      pages: this.pages,
    };
    const endpoint = "/pdf/split";
    const response = await this.app.genericRequest(
      $,
      payload,
      endpoint,
    );
    $.export("$summary", `Successfully splitted from: ${this.url}`);
    return response;
  },
};

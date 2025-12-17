import app from "../../pdf_co.app.mjs";

export default {
  name: "Search Text in PDF",
  description: "Search text in PDF and get coordinates. Supports regular expressions. [See docs here](https://apidocs.pdf.co/07-pdf-search-text)",
  key: "pdf_co-pdf-search-text",
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
    searchString: {
      propDefinition: [
        app,
        "searchString",
      ],
    },
    pages: {
      propDefinition: [
        app,
        "pages",
      ],
    },
    wordMatchingMode: {
      propDefinition: [
        app,
        "wordMatchingMode",
      ],
    },
    password: {
      propDefinition: [
        app,
        "password",
      ],
    },
    regexSearch: {
      propDefinition: [
        app,
        "regexSearch",
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
      searchString: this.searchString,
      wordMatchingMode: this.wordMatchingMode,
      password: this.password,
      regexSearch: this.regexSearch,
      pages: this.pages,
    };
    const endpoint = "/pdf/find";
    const response = await this.app.genericRequest(
      $,
      payload,
      endpoint,
    );
    $.export("$summary", `Successfully searched "${this.searchString}" from: ${this.url}`);
    return response;
  },
};

import app from "../../pdf_co.app.mjs";

export default {
  name: "PDF Split Text Search",
  description: "Split PDF by text search. [See docs here](https://apidocs.pdf.co/30-pdf-split)",
  key: "pdf_co-pdf-split-by-text-search",
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
    excludeKeyPages: {
      propDefinition: [
        app,
        "excludeKeyPages",
      ],
    },
    regexSearch: {
      propDefinition: [
        app,
        "regexSearch",
      ],
    },
    caseSensitive: {
      propDefinition: [
        app,
        "caseSensitive",
      ],
    },
    lang: {
      propDefinition: [
        app,
        "lang",
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
      excludeKeyPages: this.excludeKeyPages,
      regexSearch: this.regexSearch,
      caseSensitive: this.caseSensitive,
      lang: this.lang,
    };
    const endpoint = "/pdf/split2";
    const response = await this.app.genericRequest(
      $,
      payload,
      endpoint,
    );
    $.export("$summary", `Successfully splitted from: ${this.url}`);
    return response;
  },
};

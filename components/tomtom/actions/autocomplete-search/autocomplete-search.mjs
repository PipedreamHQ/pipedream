import app from "../../tomtom.app.mjs";

export default {
  key: "tomtom-autocomplete-search",
  name: "Autocomplete Ssearch",
  description: "Get search terms based on the provided query. [See the documentation](https://developer.tomtom.com/search-api/documentation/autocomplete-service/autocomplete)",
  version: "0.0.1",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    language: {
      propDefinition: [
        app,
        "language",
      ],
    },
    extension: {
      propDefinition: [
        app,
        "extension",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.autocompleteSearch({
      $,
      extension: this.extension,
      query: this.query,
      params: {
        language: this.language,
      },
    });
    $.export("$summary", "Successfully retrieved " + response.results.length + " results");
    return response;
  },
};

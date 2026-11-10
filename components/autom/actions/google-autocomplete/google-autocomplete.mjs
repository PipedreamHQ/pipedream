import app from "../../autom.app.mjs";

export default {
  key: "autom-google-autocomplete",
  name: "Google Autocomplete",
  description: "Get the Google autocomplete suggestions for a partial query, e.g. to collect keyword ideas. [See the documentation](https://docs.autom.dev/api-reference/google/search/autocomplete)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    language: {
      propDefinition: [
        app,
        "language",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getGoogleAutocomplete({
      $,
      params: {
        query: this.query,
        gl: this.country,
        hl: this.language,
      },
    });
    $.export("$summary", `Found ${response.suggestions?.length ?? 0} suggestions for "${this.query}"`);
    return response;
  },
};

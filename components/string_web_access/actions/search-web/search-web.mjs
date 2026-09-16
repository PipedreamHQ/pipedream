import app from "../../string_web_access.app.mjs";

export default {
  key: "string_web_access-search-web",
  name: "Search Web",
  description: "Search the web and return the organic results. [See the documentation](https://portal.usestring.ai/docs/api-reference/search)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description: "What to search for",
    },
    engine: {
      type: "string",
      label: "Engine",
      description: "Which search engine to query",
      options: [
        "google",
        "bing",
        "duckduckgo",
        "brave",
        "mojeek",
      ],
      optional: true,
      default: "google",
    },
    country: {
      type: "string",
      label: "Country",
      description: "ISO 3166-1 alpha-2 country code used to localize results, e.g. `US` or `GB`",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language tag for the results, e.g. `en` or `pt-br`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.search({
      $,
      data: {
        query: this.query,
        engine: this.engine,
        country: this.country,
        language: this.language,
      },
    });

    const count = response?.results?.length ?? 0;
    $.export("$summary", `Found ${count} result${count === 1
      ? ""
      : "s"} for "${this.query}"`);
    return response;
  },
};

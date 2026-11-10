import piloterr from "../../piloterr.app.mjs";

export default {
  key: "piloterr-google-search",
  name: "Google Search",
  description: "Search Google and return organic results with their position, title, link and snippet, plus related searches and pagination. [See the documentation](https://docs.piloterr.com/v2/api-reference/google/search)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    piloterr,
    query: {
      type: "string",
      label: "Query",
      description: "The search query, e.g. `best electric cars`. Google search operators are supported.",
    },
    country: {
      type: "string",
      label: "Country",
      description: "Two-letter country code to search from, e.g. `us`.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Two-letter language code of the results, e.g. `en`.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "City or region to search from, e.g. `Paris, France`.",
      optional: true,
    },
    page: {
      propDefinition: [
        piloterr,
        "page",
      ],
    },
    numResults: {
      type: "integer",
      label: "Number Of Results",
      description: "Number of results per page, e.g. `10`. Defaults to `10`.",
      min: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.piloterr.searchGoogle({
      $,
      params: {
        query: this.query,
        gl: this.country,
        hl: this.language,
        location: this.location,
        page: this.page,
        num: this.numResults,
      },
    });
    $.export("$summary", `Found ${response.organic_results?.length ?? 0} Google results for "${this.query}"`);
    return response;
  },
};

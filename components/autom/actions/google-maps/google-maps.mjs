import app from "../../autom.app.mjs";

export default {
  key: "autom-google-maps",
  name: "Google Maps",
  description: "Search Google Maps and return places with their address, website, phone number and coordinates, e.g. for a business type in a city. [See the documentation](https://docs.autom.dev/api-reference/google/maps)",
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
    page: {
      propDefinition: [
        app,
        "page",
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
    const response = await this.app.searchGoogleMaps({
      $,
      params: {
        query: this.query,
        page: this.page,
        gl: this.country,
        hl: this.language,
      },
    });
    $.export("$summary", `Found ${response.length ?? 0} places for "${this.query}"`);
    return response;
  },
};

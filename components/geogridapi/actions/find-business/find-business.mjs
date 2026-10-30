import geogridapi from "../../geogridapi.app.mjs";

export default {
  key: "geogridapi-find-business",
  name: "Find Business",
  description: "Find a Google Business Profile (Google Maps listing) by name and city, with its place ID (`place_id`), name, address and coordinates. Free."
    + " Use the `place_id` with **Run Grid**, **Estimate Grid**, **List Grids** or **Get Ranking History**."
    + " [See the documentation](https://geogridapi.io/en/docs#places)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    geogridapi,
    query: {
      propDefinition: [
        geogridapi,
        "query",
      ],
      description: "The business name followed by its city, e.g. `Joe's Pizza, New York`.",
      optional: false,
    },
    language: {
      propDefinition: [
        geogridapi,
        "language",
      ],
      description: "Language of the results as a 2-letter code, e.g. `en`. Defaults to `en`.",
    },
  },
  async run({ $ }) {
    const { data } = await this.geogridapi.searchPlaces({
      $,
      params: {
        q: this.query,
        language: this.language,
      },
    });
    $.export("$summary", `Found ${data.length} listing${data.length === 1 ? "" : "s"} for "${this.query}"`);
    return data;
  },
};

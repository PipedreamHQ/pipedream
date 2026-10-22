import csv2geo from "../../csv2geo.app.mjs";

export default {
  key: "csv2geo-autocomplete",
  name: "Autocomplete Address",
  description: "Get address suggestions for a partial address query. Perfect for type-ahead search and form validation. [See the documentation](https://csv2geo.com/api/docs)",
  version: "0.0.1",
  type: "action",
  props: {
    csv2geo,
    query: {
      type: "string",
      label: "Partial Address",
      description: "The partial address to autocomplete (e.g., 1600 Amphitheatre)",
    },
    country: {
      propDefinition: [
        csv2geo,
        "country",
      ],
    },
    limit: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of suggestions (1-10). Default: 5.",
      optional: true,
      default: 5,
    },
  },
  async run({ $ }) {
    const response = await this.csv2geo.autocomplete({
      $,
      params: {
        q: this.query,
        country: this.country,
        limit: this.limit,
      },
    });

    const count = response.suggestions?.length ?? 0;
    $.export("$summary", `Found ${count} suggestion(s) for "${this.query}"`);
    return response;
  },
};

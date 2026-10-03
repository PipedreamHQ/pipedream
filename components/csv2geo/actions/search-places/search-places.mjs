import csv2geo from "../../csv2geo.app.mjs";

export default {
  key: "csv2geo-search-places",
  name: "Search Places",
  description: "Search 72M+ points of interest — businesses, restaurants, landmarks, hotels, and more across 200+ countries. [See the documentation](https://csv2geo.com/api/docs)",
  version: "0.0.1",
  type: "action",
  props: {
    csv2geo,
    query: {
      type: "string",
      label: "Search Query",
      description: "Name or type of place to search for (e.g., Starbucks, hospital, hotel)",
    },
    country: {
      propDefinition: [
        csv2geo,
        "country",
      ],
    },
    category: {
      type: "string",
      label: "Category",
      description: "Filter by category (e.g., restaurant, hotel, hospital, school)",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of results (1-50). Default: 10.",
      optional: true,
      default: 10,
    },
  },
  async run({ $ }) {
    const response = await this.csv2geo.searchPlaces({
      $,
      params: {
        q: this.query,
        country: this.country,
        category: this.category,
        limit: this.limit,
      },
    });

    const count = response.results?.length ?? 0;
    $.export("$summary", `Found ${count} place(s) for "${this.query}"`);
    return response;
  },
};

import outscraper from "../../outscraper.app.mjs";

export default {
  key: "outscraper-search-places",
  name: "Search Places on Google Maps",
  description: "Searches for places on Google Maps using queries. [See the documentation](https://app.outscraper.com/api-docs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    outscraper,
    query: outscraper.propDefinitions.query,
    links: {
      ...outscraper.propDefinitions.links,
      optional: true,
    },
    placeIds: {
      ...outscraper.propDefinitions.placeIds,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.outscraper.searchPlaces({
      query: this.query,
      links: this.links || false,
      placeIds: this.placeIds || false,
    });
    $.export("$summary", `Successfully searched for places using the query: ${this.query}`);
    return response;
  },
};

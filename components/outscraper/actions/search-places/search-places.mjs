import languages from "../../common/constants/languages.mjs";
import regions from "../../common/constants/regions.mjs";
import outscraper from "../../outscraper.app.mjs";

export default {
  key: "outscraper-search-places",
  name: "Search Places on Google Maps",
  description: "Searches for places on Google Maps using queries. [See the documentation](https://app.outscraper.com/api-docs#tag/Businesses-and-POI/paths/~1maps~1search-v3/get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    outscraper,
    query: {
      type: "string",
      label: "Query",
      description: "You can use anything that you would use on a regular Google Maps site. Additionally, you can use `google_id` (feature_id), `place_id`, or `CID`. Examples of valid queries: `Real estate agency, Rome, Italy`, `The NoMad Restaurant, NY, USA`, `restaurants, Brooklyn 11203`, `0x886916e8bc273979:0x5141fcb11460b226`, `ChIJrZhup4lZwokRUr_5sLoFlDw`, etc.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The limit of organizations to take from one query search.",
      optional: true,
      min: 1,
      max: 500,
      default: 500,
    },
    coordinates: {
      propDefinition: [
        outscraper,
        "coordinates",
      ],
      description: "The latitude and longitude of the location where you want your query to be applied, e.g. `37.427074,-122.1439166`",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language to use.",
      optional: true,
      default: "en",
      options: languages,
    },
    region: {
      type: "string",
      label: "Language",
      description: "The country to use, recommended for a better search experience.",
      optional: true,
      options: regions,
    },
  },
  async run({ $ }) {
    const {
      outscraper, ...params
    } = this;
    const response = await outscraper.searchPlaces({
      $,
      params,
    });
    $.export("$summary", "Successfully searched for places");
    return response;
  },
};

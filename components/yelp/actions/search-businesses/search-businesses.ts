import { defineAction } from "@pipedream/types";
import yelp from "../../app/yelp.app";
import {
  SearchBusinessesParams,
  Business,
  SearchBusinessesResponse,
} from "../../common/types";
import { ConfigurationError } from "@pipedream/platform";

const DOCS_LINK =
  "https://docs.developer.yelp.com/reference/v3_business_search";

export default defineAction({
  name: "Search Businesses",
  description: `Search businesses matching given criteria [See docs here](${DOCS_LINK})`,
  key: "yelp-search-businesses",
  version: "0.0.9",
  type: "action",
  props: {
    yelp,
    location: {
      label: "Location",
      description: `The geographic area to be used when searching for businesses. Examples: "New York City", "NYC", "350 5th Ave, New York, NY 10118".
        \\
        Required if \`latitude\` and \`longitude\` are not provided.`,
      type: "string",
      optional: true,
    },
    latitude: {
      label: "Latitude",
      description: `Latitude of the location to search from.
        \\
        Required if \`location\` is not provided. If \`longitude\` is provided, latitude is required too.`,
      type: "string",
      optional: true,
    },
    longitude: {
      label: "Longitude",
      description: `Longitude of the location to search from.
        \\
        Required if \`location\` is not provided. If \`latitude\` is provided, longitude is required too.`,
      type: "string",
      optional: true,
    },
    term: {
      label: "Search Term",
      type: "string",
      description: `Search term, e.g. "food" or "restaurants". The term may also be the business's name, such as "Starbucks". If term is not included, the action will default to searching across businesses from a small number of popular categories.`,
      optional: true,
    },
    maxResults: {
      label: "Max Results",
      description:
        "The maximum amount of businesses to be listed. Yelp enforces a limit of 1000. Default is 200.",
      type: "integer",
      max: 1000,
      default: 200,
      optional: true,
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description:
        "Additional filters to use in the request. [See the docs for more info.](https://docs.developer.yelp.com/reference/v3_business_search)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      location,
      latitude,
      longitude,
      term,
      maxResults,
      additionalOptions,
    } = this;
    if (!(location || (latitude && longitude))) {
      throw new ConfigurationError(
        "Either `location`, or `latitude` and `longitude`, must be provided."
      );
    }

    const params: SearchBusinessesParams = {
      $,
      params: {
        location,
        latitude,
        longitude,
        term,
        maxResults,
        ...additionalOptions,
      },
    };

    const response: SearchBusinessesResponse = await this.yelp.searchBusinesses(
      params
    );
    const { result, total } = response;

    $.export(
      "$summary",
      `Listed ${result.length === total ? "all " : ""}${
        response.result.length
      } businesses successfully`
    );

    return response;
  },
});

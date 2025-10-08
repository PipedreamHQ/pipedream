import { defineAction } from "@pipedream/types";
import yelp from "../../app/yelp.app";
import {
  SearchBusinessesParams,
  SearchBusinessesResponse,
} from "../../common/types";
import { ConfigurationError } from "@pipedream/platform";
import {
  ATTRIBUTE_OPTIONS, DOCS, PRICE_OPTIONS,
} from "../../common/constants";

export default defineAction({
  name: "Search Businesses",
  description: `Search businesses matching given criteria [See docs here](${DOCS.searchBusinesses})`,
  key: "yelp-search-businesses",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      description: "Search term, e.g. \"food\" or \"restaurants\". The term may also be the business's name, such as \"Starbucks\". If term is not included, the action will default to searching across businesses from a small number of popular categories.",
      type: "string",
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
    categories: {
      label: "Categories",
      description: `Categories to filter the search results with. [See the list of supported categories.](${DOCS.categories}) The category alias should be used (e.g. "discgolf", not "Disc Golf").`,
      type: "string[]",
      optional: true,
    },
    price: {
      label: "Price",
      description: "Pricing levels to filter the search result with.",
      type: "integer[]",
      optional: true,
      options: PRICE_OPTIONS,
    },
    attributes: {
      label: "Attributes",
      description:
        "Additional filters to return specific search results. If multiple attributes are used, only businesses that satisfy all the attributes will be returned.",
      type: "string[]",
      optional: true,
      options: ATTRIBUTE_OPTIONS,
    },
    additionalOptions: {
      label: "Additional Options",
      description: `Additional parameters to pass in the request, such as \`open_now\`. [See the docs for all the parameters.](${DOCS.searchBusinesses})`,
      type: "object",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      additionalOptions,
      attributes,
      categories,
      location,
      latitude,
      longitude,
      maxResults,
      price,
      term,
    } = this;
    if (!(location || (latitude && longitude))) {
      throw new ConfigurationError(
        "Either `location`, or `latitude` and `longitude`, must be provided.",
      );
    }

    const params: SearchBusinessesParams = {
      $,
      params: {
        attributes: attributes?.join(),
        categories: categories?.join(),
        location,
        latitude,
        longitude,
        term,
        maxResults,
        price: price?.join(),
        ...additionalOptions,
      },
    };

    const response: SearchBusinessesResponse = await this.yelp.searchBusinesses(
      params,
    );
    const { result: { length } } = response;

    const summary = length
      ? `Listed ${length} business${length === 1
        ? ""
        : "es"}`
      : "No businesses found with the given criteria";

    $.export("$summary", summary);

    return response;
  },
});

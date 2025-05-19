import { parseObjectEntries } from "../../common/utils.mjs";
import dataforseo from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-search-business-listings",
  name: "Search Business Listings",
  description:
    "Get information about business entities listed on Google Maps. [See the documentation](https://docs.dataforseo.com/v3/business_data/business_listings/search/live/)",
  version: "0.0.1",
  type: "action",
  methods: {
    searchBusinessListings(args = {}) {
      return this._makeRequest({
        path: "/business_data/business_listings/search/live",
        method: "post",
        ...args,
      });
    },
  },
  props: {
    dataforseo,
    categories: {
      type: "string[]",
      label: "Business Categories",
      description: "Up to 10 categories used to search for business listings.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description:
        "Description of the business entity for which the results are collected",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description:
        "Title of the business entity for which the results are collected",
      optional: true,
    },
    locationCoordinate: {
      type: "string",
      label: "Location Coordinates",
      description:
        "The location to search, in the format `latitude,longitude,radius` where radius is specified in kilometers. Example: `53.476225,-2.243572,200`",
      optional: true,
    },
    tag: {
      propDefinition: [
        dataforseo,
        "tag",
      ],
    },
    additionalOptions: {
      propDefinition: [
        dataforseo,
        "additionalOptions",
      ],
      description:
        "Additional parameters to send in the request. [See the documentation](https://docs.dataforseo.com/v3/business_data/business_listings/search/live/) for all available parameters. Values will be parsed as JSON where applicable.",
    },
  },
  async run({ $ }) {
    const response = await this.getBacklinksHistory({
      $,
      data: [
        {
          categories: this.categories,
          description: this.description,
          title: this.title,
          location_coordinate: this.locationCoordinate,
          tag: this.tag,
          ...parseObjectEntries(this.additionalOptions),
        },
      ],
    });
    $.export("$summary", "Successfully retrieved business listings");
    return response;
  },
};

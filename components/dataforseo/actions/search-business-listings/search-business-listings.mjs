import { parseObjectEntries } from "../../common/utils.mjs";
import dataforseo from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-search-business-listings",
  name: "Search Business Listings",
  description:
    "Get information about business entities listed on Google Maps. [See the documentation](https://docs.dataforseo.com/v3/business_data/business_listings/search/live/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  methods: {
    searchBusinessListings(args = {}) {
      return this.dataforseo._makeRequest({
        path: "/business_data/business_listings/search/live",
        method: "post",
        ...args,
      });
    },
  },
  props: {
    dataforseo,
    categories: {
      propDefinition: [
        dataforseo,
        "categories",
      ],
    },
    description: {
      propDefinition: [
        dataforseo,
        "description",
      ],
    },
    title: {
      propDefinition: [
        dataforseo,
        "title",
      ],
    },
    locationCoordinate: {
      propDefinition: [
        dataforseo,
        "locationCoordinate",
      ],
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
    const response = await this.searchBusinessListings({
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

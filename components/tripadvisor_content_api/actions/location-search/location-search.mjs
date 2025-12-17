import app from "../../tripadvisor_content_api.app.mjs";

export default {
  key: "tripadvisor_content_api-location-search",
  name: "Search Locations",
  description: "Returns up to 10 locations found by the given search query. [See the documentation](https://tripadvisor-content-api.readme.io/reference/searchforlocations)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    searchQuery: {
      propDefinition: [
        app,
        "searchQuery",
      ],
    },
    category: {
      propDefinition: [
        app,
        "category",
      ],
    },
    address: {
      propDefinition: [
        app,
        "address",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchLocations({
      $,
      params: {
        searchQuery: this.searchQuery,
        category: this.category,
        address: this.address,
      },
    });

    $.export("$summary", `Found ${response.data.length} location(s)`);

    return response;
  },
};

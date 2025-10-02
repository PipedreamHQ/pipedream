import app from "../../tripadvisor_content_api.app.mjs";

export default {
  key: "tripadvisor_content_api-location-reviews",
  name: "Get Location Reviews",
  description: "Returns up to 5 of the most recent reviews for a specific location. [See the documentation](https://tripadvisor-content-api.readme.io/reference/getlocationreviews)",
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
    locationId: {
      propDefinition: [
        app,
        "locationId",
        (c) => ({
          searchQuery: c.searchQuery,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getLocationReviews({
      $,
      locationId: this.locationId,
    });

    $.export("$summary", `Successfully listed ${response.data.length} of the most recent reviews for the specified location`);

    return response;
  },
};

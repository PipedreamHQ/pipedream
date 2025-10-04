import app from "../../tripadvisor_content_api.app.mjs";

export default {
  key: "tripadvisor_content_api-location-details",
  name: "Get Location Details",
  description: "Returns comprehensive information about a location. [See the documentation](https://tripadvisor-content-api.readme.io/reference/getlocationdetails)",
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
    const response = await this.app.getLocationDetails({
      $,
      locationId: this.locationId,
    });

    $.export("$summary", `Successfully returned the details for location '${response.name}'`);

    return response;
  },
};

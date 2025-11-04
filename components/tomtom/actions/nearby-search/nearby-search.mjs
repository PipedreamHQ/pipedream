import app from "../../tomtom.app.mjs";

export default {
  key: "tomtom-nearby-search",
  name: "Nearby Search",
  description: "Get Points of Interest around your current location. [See the documentation](https://developer.tomtom.com/search-api/documentation/search-service/search-service)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    language: {
      propDefinition: [
        app,
        "language",
      ],
    },
    lat: {
      propDefinition: [
        app,
        "lat",
      ],
    },
    lon: {
      propDefinition: [
        app,
        "lon",
      ],
    },
    radius: {
      propDefinition: [
        app,
        "radius",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.nearbySearch({
      $,
      params: {
        language: this.language,
        lat: this.lat,
        lon: this.lon,
        radius: this.radius,
        limit: this.limit,
      },
    });
    $.export("$summary", "Successfully retrieved " + response.results.length + " results");
    return response;
  },
};

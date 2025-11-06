import app from "../../tomtom.app.mjs";

export default {
  key: "tomtom-poi-search",
  name: "POI Search",
  description: "Search for Points of Interest. [See the documentation](https://developer.tomtom.com/search-api/documentation/search-service/points-of-interest-search)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
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
    const response = await this.app.poiSearch({
      $,
      query: this.query,
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

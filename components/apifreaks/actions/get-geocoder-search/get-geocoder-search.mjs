import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-geocoder-search",
  name: "Forward Geocoding (Address to Coordinates)",
  description: "Convert a given address or place name into geographic coordinates (latitude and longitude). [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description: "Free-form search query, e.g. Wembley Stadium, London",
      optional: false,
    },
    limit: {
      type: "string",
      label: "Limit",
      description: "Max number of results to return (1–40). May return fewer if matches are weak.",
      optional: true,
    },
    minLat: {
      type: "string",
      label: "Min Lat",
      description: "Minimum latitude for the viewbox. Must be ≤ max_lat and between -90 and 90.",
      optional: true,
    },
    maxLat: {
      type: "string",
      label: "Max Lat",
      description: "Maximum latitude for the viewbox. Must be ≥ min_lat and between -90 and 90.",
      optional: true,
    },
    minLon: {
      type: "string",
      label: "Min Lon",
      description: "Minimum longitude for the viewbox. Must be ≤ max_lon and between -180 and 180.",
      optional: true,
    },
    maxLon: {
      type: "string",
      label: "Max Lon",
      description: "Maximum longitude for the viewbox. Must be ≥ min_lon and between -180 and 180.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/geocoder/search",
      params: {
        query: this.query,
        limit: this.limit,
        "min_lat": this.minLat,
        "max_lat": this.maxLat,
        "min_lon": this.minLon,
        "max_lon": this.maxLon,
      },
    });
    $.export("$summary", "Successfully executed Forward Geocoding (Address to Coordinates)");
    return response;
  },
};

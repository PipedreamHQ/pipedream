import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-geocoder-reverse",
  name: "Reverse Geocoding (Coordinates to Address)",
  description: "Convert geographic coordinates (latitude and longitude) into a human-readable address or place name. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    lat: {
      type: "string",
      label: "Lat",
      description: "WGS84 latitude value ranging from -90 to 90.",
      optional: false,
    },
    lon: {
      type: "string",
      label: "Lon",
      description: "WGS84 longitude value ranging from -180 to 180.",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/geocoder/reverse",
      params: {
        lat: this.lat,
        lon: this.lon,
      },
    });
    $.export("$summary", "Successfully executed Reverse Geocoding (Coordinates to Address)");
    return response;
  },
};

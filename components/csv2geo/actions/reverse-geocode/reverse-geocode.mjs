import csv2geo from "../../csv2geo.app.mjs";

export default {
  key: "csv2geo-reverse-geocode",
  name: "Reverse Geocode",
  description: "Convert latitude/longitude coordinates to a street address. Supports 200+ countries. [See the documentation](https://csv2geo.com/api/docs)",
  version: "0.0.1",
  type: "action",
  props: {
    csv2geo,
    latitude: {
      propDefinition: [
        csv2geo,
        "latitude",
      ],
    },
    longitude: {
      propDefinition: [
        csv2geo,
        "longitude",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.csv2geo.reverseGeocode({
      $,
      params: {
        lat: this.latitude,
        lng: this.longitude,
      },
    });

    const result = response.results?.[0];
    if (result) {
      $.export("$summary", `Reverse geocoded ${this.latitude}, ${this.longitude} → "${result.formatted_address}"`);
    } else {
      $.export("$summary", `No address found for ${this.latitude}, ${this.longitude}`);
    }
    return response;
  },
};

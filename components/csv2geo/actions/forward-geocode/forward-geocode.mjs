import csv2geo from "../../csv2geo.app.mjs";

export default {
  key: "csv2geo-forward-geocode",
  name: "Forward Geocode",
  description: "Convert an address to latitude/longitude coordinates. Supports 200+ countries with rooftop-level accuracy. [See the documentation](https://csv2geo.com/api/docs)",
  version: "0.0.1",
  type: "action",
  props: {
    csv2geo,
    address: {
      propDefinition: [
        csv2geo,
        "address",
      ],
    },
    country: {
      propDefinition: [
        csv2geo,
        "country",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.csv2geo.geocode({
      $,
      params: {
        q: this.address,
        country: this.country,
      },
    });

    const result = response.results?.[0];
    if (result) {
      $.export("$summary", `Geocoded "${this.address}" → ${result.location.lat}, ${result.location.lng}`);
    } else {
      $.export("$summary", `No results found for "${this.address}"`);
    }
    return response;
  },
};

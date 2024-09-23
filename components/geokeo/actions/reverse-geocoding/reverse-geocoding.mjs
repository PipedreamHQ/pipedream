import app from "../../geokeo.app.mjs";

export default {
  key: "geokeo-reverse-geocoding",
  name: "Reverse geocoding",
  description: "Convert geographic coordinates to address data. [See the documentation](https://geokeo.com/documentation.php#request-reverse-geocoding)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    lat: {
      propDefinition: [
        app,
        "lat",
      ],
    },
    lng: {
      propDefinition: [
        app,
        "lng",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.reverseGeocoding({
      $,
      params: {
        lat: this.lat,
        lng: this.lng,
      },
    });

    $.export("$summary", `${response.results.length} results found`);

    return response;
  },
};
